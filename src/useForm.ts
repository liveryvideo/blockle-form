import { useContext, useEffect } from 'react';

import { FormContext } from 'context';
import { useForceUpdate } from 'useForceUpdate';
import * as actions from 'store/actions';
import { getField } from 'store/selectors';
import { ValidationErrors } from 'types';

type Validator = (value: any) => ValidationErrors;

type UseForm<V = any> = {
  name: string,
  value: V
  validate: Validator,
};

function arrayCompare(a: any[], b: any[]) {
  let i = a.length;

  if (i !== b.length) {
    return false;
  }

  // tslint:disable-next-line:no-increment-decrement
  while (i--) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  // for (let i = 0; i <) {
  //   // console.log('kill', index, a[index], b[index]);
  //   if (a[index] !== b[index]) {
  //     return false;
  //   }
  // }

  return true;
}

type ObjectLike = { [key: string]: any };

function objectCompare(a: ObjectLike, b: ObjectLike) {
  const keys = Object.keys(a);

  if (keys.length !== Object.keys(b).length) {
    return false;
  }

  for (const key of keys) {
    // console.log(a[key], b[key]);
    if (!isShallowEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

function isShallowEqual(a: any, b: any) {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (Array.isArray(a)) {
    return arrayCompare(a, b);
  }

  if (a && typeof a === 'object') {
    return objectCompare(a, b);
  }

  return false;
}

// @ts-ignore
window.shallowCompare = isShallowEqual;

export const useForm = <V extends any>({ value, name, validate }: UseForm<V>) => {
  const store = useContext(FormContext);
  const forceUpdate = useForceUpdate();
  const setValue = (value: V) => store.dispatch(actions.setValue({ name, value, errors: validate(value) }));
  const getState = () => getField(store.getState(), name);

  if (!store) {
    throw new Error('Forgot to wrap form element in <Form>?');
  }

  // Mhhh... Side effect
  // TODO
  if (!getState()) {
    setValue(value);
  }

  // Update value when "prop.value" changes
  // useEffect(() => {
  //   // console.log(getState().value, value);
  //   setValue(value);
  //   // console.log('Value changed');
  // }, [value]);

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = store.subscribe((state, prevState) => {
      // console.log('Setter');
      // console.log(state[name], prevState[name], isShallowEqual(state[name], prevState[name]));
      // console.log(state[name], prevState[name], isShallowEqual(state[name], prevState[name]));

      if (!isShallowEqual(state[name], prevState[name])) {
        // console.log(state);
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
    ...state,
    value: state.value as V,
    dirty: state.value !== value,
    invalid: state.invalid,
    setValue,
  };
};
