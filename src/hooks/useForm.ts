import { useContext, useEffect, useRef, useState } from 'react';

import { FormContext } from 'context';

type Validator<V> = (value: V) => null | string;

interface UseForm<V> {
  name: string;
  value: V;
  validate?: Validator<V>;
}

const createInitialState = <V>(value: V) => ({
  dirty: false,
  invalid: false,
  touched: false,
  validationMessage: '',
  value,
});

export const useForm = <V>({ name, value, validate }: UseForm<V>) => {
  const form = useContext(FormContext);
  const [state, setState] = useState(createInitialState(value));
  const stateRef = useRef(state);

  stateRef.current = state;

  useEffect(
    () =>
      form.register({
        name,
        stateRef,
        validate() {
          const state = stateRef.current;
          const validity = validator(state.value, true);
          const nextState = {
            ...state,
            touched: true,
            invalid: !!validity,
            validationMessage: validity || '',
          };

          setState(nextState);

          form.notify(name, nextState);

          return !validity;
        },
      }),
    [name],
  );

  useEffect(() => {
    setValue(value);
  }, [JSON.stringify(value)]);

  function validator(value: any, force = false) {
    if (!validate) {
      return null;
    }

    if (force) {
      return validate ? validate(value) : null;
    }

    return (state.touched || state.dirty) && validate ? validate(value) : null;
  }

  function setValue(value: any) {
    const validity = validator(value);
    const nextState = {
      ...state,
      value,
      invalid: !!validity,
      validationMessage: validity || '',
      dirty: value !== state.value,
    };

    setState(nextState);

    // Emit change
    form.notify(name, nextState);
  }

  function setTouched() {
    setState({
      ...state,
      touched: true,
    });
  }

  return { ...state, setValue, setTouched };
};
