import { useContext, useEffect, useState } from 'react';

import { FormContext } from './context';
import { init, setValue, setTouched, setValidity, setDirty } from './store/actions';
import { FieldState } from './types';

type Options<V> = {
  validate: (value: V) => null | string;
  value: V;
};

// const fieldStateDidChange = (state: FieldState, prevState: FieldState) =>
//   state.value !== prevState.value ||
//   state.validationMessage !== prevState.validationMessage ||
//   state.dirty !== prevState.dirty ||
//   state.touched !== prevState.touched;

export type UseField<V> = FieldState<V> & {
  setValue: (value: V) => void;
  setTouched: () => void;
  // setValidity: (validationMessage: FieldState<never>['validationMessage']) => void;
};

export const useField = <V>(name: string, options: Options<V>): UseField<V> => {
  const store = useContext(FormContext);
  const [state, setState] = useState<FieldState<V>>({
    name,
    dirty: false,
    invalid: false,
    touched: false,
    validationMessage: null,
    value: options.value,
  });

  useEffect(() => {
    console.log('update', name, options.value);

    store.dispatch(setValue<V>(name, options.value));
    store.dispatch(setDirty(name, options.value !== options.value));

    if (options.validate) {
      store.dispatch(setValidity(name, options.validate(options.value)));
    }
  }, [options.value]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const nextState = store.getState();

      // if (fieldStateDidChange(nextState[name], state)) {
      setState(nextState[name] as FieldState<V>);
      // }
    });

    store.dispatch(init(name, options.value));

    if (options.validate) {
      store.dispatch(setValidity(name, options.validate(options.value)));
    }

    return unsubscribe;
  }, [name]);

  return {
    ...state,
    invalid: state.validationMessage !== null,
    setValue(value) {
      store.dispatch(setValue<V>(name, value));
      store.dispatch(setDirty(name, value !== options.value));

      if (options.validate) {
        store.dispatch(setValidity(name, options.validate(value)));
      }
    },
    setTouched() {
      store.dispatch(setTouched(name));
    },
    // setValidity(validationMessage) {
    //   store.dispatch(setValidity(name, validationMessage));
    // },
  };
};
