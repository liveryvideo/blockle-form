import { useContext, useEffect } from 'react';

import { FormContext } from './context';
import { initField, setTouched, updateField, removeField } from './store/actions';
import { useFieldState } from './useFieldState';

type Options<V> = {
  validate: (value: V) => null | string;
  value: V;
};

export const useField = <V>(name: string, options: Options<V>) => {
  const state = useFieldState<V>(name, options.value);
  const store = useContext(FormContext);
  const setValue = (value: V) => {
    store.dispatch(
      updateField(name, {
        value,
        dirty: value !== options.value,
        validationMessage: options.validate(value),
        touched: true,
      }),
    );
  };

  // Update value whenever value (given by props) changes
  // Check is done with JSON.stringify to compare objects etc
  useEffect(() => {
    setValue(options.value);
  }, [options && JSON.stringify(options.value)]);

  // Init store state
  useEffect(() => {
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

  return {
    ...state,
    setValue,
    setTouched() {
      store.dispatch(setTouched(name));
    },
  };
};
