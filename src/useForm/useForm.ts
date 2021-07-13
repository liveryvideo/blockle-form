import { useLayoutEffect, useRef, useState } from 'react';
import { updateField } from '../store/actions';
import { createStore } from '../store/createStore';
import { FormReducer } from '../store/reducer';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EmptyInterface {}

export interface UseForm<Data extends EmptyInterface> {
  dirty: boolean;
  invalid: boolean;
  submitting: boolean;
  touched: boolean;
  setValue: <Name extends keyof Data>(name: Name, value: Data[Name]) => void;
  store: ReturnType<typeof createStore>;
  submit: (data: Data) => Promise<void> | void;
  values: Data;
  errors: Record<keyof Data, string | null>;
}

interface Options<Data> {
  submit: (data: Data) => Promise<void> | void;
}

interface Ref {
  store: ReturnType<typeof createStore> | null;
}

interface State<Data extends EmptyInterface> {
  dirty: boolean;
  invalid: boolean;
  submitting: boolean;
  touched: boolean;
  values: Data;
  errors: Record<keyof Data, string | null>;
}

function getValues<Data extends FormReducer>(state: Data): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(state.fields).map(([name, field]) => [name, field.value]),
  );
}

function getErrors<Data extends FormReducer>(state: Data): Record<string, string | null> {
  return Object.fromEntries(
    Object.entries(state.fields).map(([name, field]) => [name, field.error]),
  );
}

export function useForm<Data extends EmptyInterface>({ submit }: Options<Data>): UseForm<Data> {
  const [state, setState] = useState<State<Data>>({
    dirty: false,
    invalid: false,
    touched: false,
    submitting: false,
    values: {} as Data,
    errors: {} as Record<keyof Data, string | null>,
  });
  const { current } = useRef<Ref>({
    store: null,
  });

  if (!current.store) {
    current.store = createStore();
  }

  useLayoutEffect(() => {
    return current.store?.subscribe(() => {
      if (!current.store) {
        return;
      }

      const formState = current.store.getState();
      const fields = Object.values(formState.fields);

      setState((state) => ({
        ...state,
        submitting: formState.submitting,
        dirty: fields.some(({ dirty }) => dirty),
        invalid: fields.some(({ error }) => !!error),
        touched: fields.some(({ touched }) => touched),
        values: getValues(formState) as Data,
        errors: getErrors(formState) as Record<keyof Data, string | null>,
      }));
    });
  }, [current.store]);

  return {
    ...state,
    store: current.store,
    submit,
    setValue(name, nextValue) {
      current.store?.dispatch(updateField(name as string, nextValue));
    },
  };
}
