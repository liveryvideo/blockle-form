import { useContext, useEffect } from 'react';

import { FormContext } from 'context';
import { useForceUpdate } from 'useForceUpdate';
import { updateField } from 'store/actions';
import { getField } from 'store/selectors';

type Validator = (value: any) => null | string;

type UseForm<V = any> = {
  name: string,
  value: V
  validate: Validator,
};

export const useForm = <V>({ value, name, validate }: UseForm<V>) => {
  const store = useContext(FormContext);
  const forceUpdate = useForceUpdate();
  const setValue = (value: V) => store.dispatch(updateField({ name, value, invalid: validate(value) }));
  const getState = () => getField(store.getState(), name);

  if (!store) {
    throw new Error('Forgot to wrap form element in <Form>?');
  }

  // Mhhh... Side effect
  if (!getState()) {
    setValue(value);
  }

  // Update value when "prop.value" changes
  useEffect(() => {
    setValue(value);
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
  }, [name]);

  const state = getState();

  return {
    value: state.value as V,
    dirty: state.value !== value,
    invalid: state.invalid,
    setValue,
  };
};
