import { useContext, useEffect, useState, useRef } from 'react';

import { FormContext } from 'context';
import { ValidationErrors, FormField } from 'types';

type Validator = (value: any) => ValidationErrors;

type UseForm<V = any, C = any> = {
  name: string,
  value: V
  validate: Validator,
  computeValue?: (value: V) => C,
};

export const useForm = <V extends any>({ value, name, validate, computeValue }: UseForm<V>) => {
  const context = useContext(FormContext);
  const [state, setState] = useState<FormField>({
    value,
    name,
    valid: validate(value) === null,
    touched: false,
    computeValue,
  });
  const ref = useRef(state);

  ref.current = state;

  useEffect(() => {
    return context.register(ref);
  }, []);

  return {
    value: state.value,
    dirty: state.value !== value,
    touched: state.touched,
    invalid: !state.valid,
    setValue(value: V) {
      const errors = validate(value);

      setState({
        ...state,
        value,
        valid: errors === null,
        errors,
        touched: true,
      });

      // shallow compare?
      if (errors !== state.errors) {
        context.dispatchError(name, errors);
      }
    },
  };
};
