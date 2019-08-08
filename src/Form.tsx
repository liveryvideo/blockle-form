import React, { useMemo, MutableRefObject } from 'react';

import { FormContext, Context } from 'context';
import { FormData, FormField, ValidationErrors } from 'types';

type Props = {
  autocomplete?: boolean,
  children?: React.ReactNode,
  onSubmit: (values: FormData) => void,
  id?: string,
  className?: string;
};

type Fields = MutableRefObject<FormField>[];

function validateFields(fields: Fields) {
  console.log('validate', fields);

  return fields.every(({ current }) => !!current.valid);
}

function getFormData(fields: Fields): FormData {
  const map: FormData = {};

  fields.forEach((ref) => {
    const field = ref.current;

    map[field.name] = field.computeValue ? field.computeValue(field.value) : field.value;
  });

  return map;
}

export type Listener = (name: string, error: ValidationErrors) => void;

const Form = ({ autocomplete, children, onSubmit, id, className }: Props) => {
  const fields: Fields = useMemo(() => [], []);
  const listeners: Listener[] = useMemo(() => [], []);

  // Move this to createFormContext?
  const context: Context = useMemo(() => ({
    register(ref: MutableRefObject<FormField>) {
      fields.push(ref);

      return () => {
        const index = fields.indexOf(ref);
        fields.splice(index, 1);
      };
    },
    dispatchError(name: string, error: ValidationErrors) {
      listeners.forEach(Listener => Listener(name, error));
    },
    onFieldError(listener: Listener) {
      listeners.push(listener);

      return () => {
        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    },
  }), []);

  const submit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateFields(fields)) {
      console.log('Some fields are invalid');
      return;
    }

    const formData = getFormData(fields);

    onSubmit(formData);
  };

  return (
    <FormContext.Provider value={context}>
      <form
        autoComplete={autocomplete ? 'on' : 'off'}
        onSubmit={submit}
        noValidate
        id={id}
        className={className}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

export default Form;
