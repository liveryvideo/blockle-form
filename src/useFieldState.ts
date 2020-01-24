import { useState, useRef, useEffect, useContext } from 'react';

import { FieldState } from './types';
import { FormContext } from './context';
import { globalStore } from './globalStore';

export const useFieldState = <V = unknown>(name: string, initialValue?: any) => {
  const store = useContext(FormContext) || globalStore;
  const [state, setState] = useState<FieldState<V>>({
    name,
    dirty: false,
    touched: false,
    validationMessage: null,
    value: initialValue,
  });

  const currentState = useRef(state);

  // Update local state
  useEffect(() => {
    return store.subscribe(() => {
      const prevState = currentState.current;
      const nextState = store.getState()[name] as FieldState<V>;

      if (prevState !== nextState) {
        setState(nextState);
        currentState.current = nextState;
      }
    });
  }, [name]);

  return {
    ...state,
    invalid: state.validationMessage !== null,
  };
};
