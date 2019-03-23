import React, { useMemo } from 'react';

import { FormContext } from 'context';
import { createStore } from 'createStore';
import { formReducer, FormState } from 'formReducer';

type Props = {
  autocomplete?: boolean,
  children?: React.ReactNode,
  onSubmit: () => Promise<any>,
};

type Values = {
  [key: string]: any,
};

const Form = ({ autocomplete, children, onSubmit }: Props) => {
  const store = useMemo(
    () => createStore<FormState>({}, formReducer),
    [],
  );

  const submit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const state = store.getState();
    const values: Values = {};
    let invalid = false;

    Object.values(state).forEach((field) => {
      if (field.invalid) {
        invalid = true;
      }

      values[field.name] = field.value;
    });

    if (invalid) {
      return console.log('Form invalid');
    }

    console.log('Form submit', store.getState());
    // Validate
    // onSubmit(selectNameValue(state));
  };

  return (
    <FormContext.Provider value={store}>
      <form
        autoComplete={autocomplete ? 'on' : 'off'}
        onSubmit={submit}
        noValidate
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

export default Form;
