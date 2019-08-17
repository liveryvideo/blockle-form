import { useContext, useEffect, useState } from 'react';

import { FormContext } from '../context';
import { FormFieldState } from '../types';

export const useFormField = (target: string) => {
  const context = useContext(FormContext);
  const [state, setState] = useState<FormFieldState>({
    dirty: false,
    invalid: false,
    touched: false,
    validationMessage: '',
    value: null,
  });

  useEffect(
    () =>
      context.subscribe((name, state) => {
        if (name !== target) {
          return;
        }

        setState(state);
      }),
    [],
  );

  return state;
};
