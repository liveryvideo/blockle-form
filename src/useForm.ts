import { useContext, useEffect } from 'react';

import { FormContext } from 'context';
import { useForceUpdate } from 'useForceUpdate';

export const useForm = <V = any>(name: string, value: V) => {
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
    store.dispatch({ type: 'SET_VALUE', payload: { name, value } });
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
    setValue: (value: any) => store.dispatch({ type: 'SET_VALUE', payload: { name, value } }),
  };
};
