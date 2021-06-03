import { useContext, useEffect } from 'react';
import { FormContext } from '../FormContext/FormContext';
import { initField, removeField, setFieldTouched, updateField } from '../store/actions';

interface UseFieldOptions<Value> {
  name: string;
  validate?: (value: Value) => string | null;
  value?: Value;
}

interface UseField<Value> {
  dirty: boolean;
  error: string | null;
  invalid: boolean;
  touched: boolean;
  value: Value;
  setValue: (value: Value) => void;
  setTouched: () => void;
}

export function useField<Value>({
  name,
  validate = () => null,
  value,
}: UseFieldOptions<Value>): UseField<Value> {
  const store = useContext(FormContext);

  if (!store) {
    throw new Error('useField must be descendant of Form');
  }

  const state = store.getState().fields[name] || { value };

  useEffect(() => {
    store.dispatch(initField(name, value));

    store.dispatch(
      updateField(name, {
        value: value,
        error: validate(value as Value),
      }),
    );

    return () => {
      store.dispatch(removeField(name));
    };
  }, [name]);

  useEffect(() => {
    store.dispatch(
      updateField(name, {
        value,
        error: validate(value as Value),
      }),
    );
  }, [name, value]);

  return {
    ...state,
    value: state.value as Value,
    invalid: !!state.error,
    setValue(nextValue) {
      store.dispatch(
        updateField(name, {
          value: nextValue,
          error: validate(nextValue),
        }),
      );
    },
    setTouched() {
      store.dispatch(setFieldTouched(name));
    },
  };
}
