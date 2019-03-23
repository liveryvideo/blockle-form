import { useContext, useEffect } from 'react';

import { FormContext } from 'context';
import { useForceUpdate } from 'useForceUpdate';

type Validator = (value: any) => null | string;

type UseForm<V = any> = {
  name: string,
  value: V
  validate: Validator,
};

export const useForm = <V>({ value, name, validate }: UseForm<V>) => {
  const store = useContext(FormContext);
  const forceUpdate = useForceUpdate();

  if (!store) {
    throw new Error('Forgot to wrap form element in <Form>?');
  }

  // TODO Nicer way to declare default
  if (!store.getState()[name]) {
    store.dispatch({ type: 'INIT', payload: { name, value } });
  }

  // Update value when "prop.value" changes
  useEffect(() => {
    store.dispatch({ type: 'SET_VALUE', payload: { name, value, invalid: validate(value) } });
  }, [value]);

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = store.subscribe((state, prevState) => {
      if (state[name] !== prevState[name]) {
        forceUpdate();
      }
    });

    return () => {
      unsubscribe();

      store.dispatch({ type: 'REMOVE', payload: { name } });
    };
  }, []);

  const state = store.getState()[name];

  return {
    value: state.value as V,
    dirty: state.value !== value,
    invalid: state.invalid,
    setValue: (value: V) => {
      store.dispatch({
        type: 'SET_VALUE', payload: {
          name,
          value,
          invalid: validate(value),
        },
      });
    },
  };
};
