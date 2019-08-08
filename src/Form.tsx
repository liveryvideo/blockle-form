import React, { useMemo, useState, MutableRefObject } from 'react';

import { FormContext } from 'context';
import { FormData, FormField } from 'types';

type Props = {
  autocomplete?: boolean,
  children?: React.ReactNode,
  onSubmit: (values: FormData) => void,
  id?: string,
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

const Form = ({ autocomplete, children, onSubmit, id }: Props) => {
  const [fields] = useState<Fields>([]);
  const context = useMemo(() => ({
    register(ref: MutableRefObject<FormField>) {
      fields.push(ref);
      return () => {
        const index = fields.indexOf(ref);
        fields.splice(index, 1);
      };
    },
  }), []);

  const submit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateFields(fields)) {
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
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

export default Form;
