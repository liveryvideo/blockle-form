import { useContext, useEffect, useState } from 'react';

import { ValidationErrors } from './types';
import { FormContext } from 'context';

export const useFormError = (inputName: string): ValidationErrors => {
  const context = useContext(FormContext);
  const [errors, setError] = useState<ValidationErrors>(null);

  useEffect(() => {
    return context.onFieldError((name, error) => {
      if (name !== inputName) {
        return;
      }

      setError(error);
    });
  });

  return errors;
};
