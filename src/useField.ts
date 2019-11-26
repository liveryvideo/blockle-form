import { useContext, useEffect, useRef } from 'react';

import { FormContext } from './context';
import { initField, setTouched, updateField, removeField } from './store/actions';
import { useFieldState } from './useFieldState';
import { globalStore } from './globalStore';
import { FieldState } from './types';

type Options<V> = {
  validate: (value: V) => null | string;
  value: V;
  onChange?: (value: V) => void;
};

export const useField = <V>(name: string, options: Options<V>) => {
  const state = useFieldState<V>(name, options.value);
  const store = useContext(FormContext) || globalStore;
  const initialCall = useRef(true);
  const setValue = (value: V) => {
    store.dispatch(
      updateField(name, {
        value,
        dirty: value !== options.value,
        validationMessage: options.validate(value),
      }),
    );

    if (options.onChange) {
      options.onChange(value);
    }
  };

  // Init store state
  useEffect(() => {
    const state = store.getState()[name] as FieldState<V>;

    if (state) {
      return;
    }

    store.dispatch(
      initField(name, {
        value: options.value,
        validationMessage: options.validate(options.value),
      }),
    );

    // TODO How to handle "removeField" when multiple components have the same name?
    return () => {
      store.dispatch(removeField(name));
    };
  }, [name]);

  // Update value whenever value (given by props) changes
  // Check is done with JSON.stringify to compare objects etc
  useEffect(() => {
    if (!initialCall.current) {
      setValue(options.value);
    }

    initialCall.current = false;
  }, [JSON.stringify(options.value)]);

  return {
    ...state,
    setValue,
    setTouched() {
      store.dispatch(setTouched(name));
    },
  };
};
