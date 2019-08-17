import { useContext, useEffect, useReducer, useRef } from 'react';

import { FormContext } from 'context';
import {
  fieldReducer,
  createInitialState,
  createFieldActions,
} from 'reducers/fieldReducer';

interface UseForm<V> {
  name: string;
  value: V | null;
  validate?: (value: V) => null | string;
  // computeValue?: (value: V) => any;
}

export const useForm = <V>({ name, value = null, validate }: UseForm<V>) => {
  const form = useContext(FormContext);
  const [state, dispatch] = useReducer(fieldReducer, createInitialState(value));
  const actions = createFieldActions(dispatch);
  const ref = useRef(state);

  useEffect(() => form.register(name, ref), [name]);

  useEffect(() => {
    actions.setValue(value);
  }, [JSON.stringify(value)]);

  return { ...state, ...actions };
};
