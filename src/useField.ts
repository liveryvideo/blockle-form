import { useContext, useEffect, useState, useRef } from 'react';

import { FormContext } from './context';
import { initField, setTouched, updateField, removeField } from './store/actions';
import { FieldState } from './types';

type Options<V> = {
  validate: (value: V) => null | string;
  value: V;
};

const stateDidChange = <V>(state: FieldState<V>, prevState: FieldState<V>) => {
  if (
    state.value !== prevState.value ||
    state.dirty !== prevState.dirty ||
    state.touched !== prevState.touched ||
    state.validationMessage !== prevState.validationMessage
  ) {
    return true;
  }

  return false;
};

export const useField = <V>(name: string, options: Options<V>) => {
  const store = useContext(FormContext);
  const [state, setState] = useState<FieldState<V>>({
    name,
    dirty: false,
    touched: false,
    validationMessage: null,
    value: options.value,
  });
  const currentState = useRef(state);

  // Update value whenever value (given by props) changes
  useEffect(() => {
    store.dispatch(
      updateField(name, {
        value: options.value,
        dirty: false,
        validationMessage: options.validate(options.value),
      }),
    );
  }, [options.value]);

  useEffect(() => {
    // Update local state
    const unsubscribe = store.subscribe(() => {
      const prevState = currentState.current;
      const nextState = store.getState()[name] as FieldState<V>;

      if (prevState && nextState && stateDidChange<V>(nextState, prevState)) {
        setState(nextState);
        currentState.current = nextState;
      }
    });

    store.dispatch(
      initField(name, {
        value: options.value,
        validationMessage: options.validate(options.value),
      }),
    );

    return () => {
      unsubscribe();
      store.dispatch(removeField(name));
    };
  }, [name]);

  return {
    ...state,
    invalid: state.validationMessage !== null,
    setValue(value: V) {
      store.dispatch(
        updateField(name, {
          value,
          dirty: value !== options.value,
          validationMessage: options.validate(value),
        }),
      );
    },
    setTouched() {
      store.dispatch(setTouched(name));
    },
  };
};
