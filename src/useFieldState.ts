import { useContext, useEffect, useRef, useState } from 'react';
import { FormContext } from './context';
import { globalStore } from './globalStore';
import { FieldState } from './types';

export const useFieldState = <V = unknown>(name: string, initialValue: V) => {
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

      if (nextState && prevState !== nextState) {
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
