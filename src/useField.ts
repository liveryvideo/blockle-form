import { useContext, useEffect, useState } from 'react';

import { FormContext } from 'context';
import { init, setValue, setTouched, setValidity, setDirty } from 'store/actions';
import { FieldState } from 'types';

type Options = {
  validate: (value: string) => null | string;
  value: string;
};

// const fieldStateDidChange = (state: FieldState, prevState: FieldState) =>
//   state.value !== prevState.value ||
//   state.validationMessage !== prevState.validationMessage ||
//   state.dirty !== prevState.dirty ||
//   state.touched !== prevState.touched;

export const useField = (name: string, options: Options) => {
  const store = useContext(FormContext);
  const [state, setState] = useState<FieldState>({
    name,
    dirty: false,
    invalid: false,
    touched: false,
    validationMessage: null,
    value: options.value,
  });

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const nextState = store.getState();

      // if (fieldStateDidChange(nextState[name], state)) {
      setState(nextState[name]);
      // }
    });

    store.dispatch(init(name, options.value));

    return unsubscribe;
  }, [name]);

  return {
    ...state,
    invalid: state.validationMessage !== null,
    setValue: (value: string) => {
      store.dispatch(setValue(name, value));
      store.dispatch(setDirty(name, value !== options.value));

      if (options.validate) {
        store.dispatch(setValidity(name, options.validate(value)));
      }
    },
    setTouched: (name: string) => {
      store.dispatch(setTouched(name));
    },
    setValidity: (validationMessage: FieldState['validationMessage']) => {
      store.dispatch(setValidity(name, validationMessage));
    },
  };
};
