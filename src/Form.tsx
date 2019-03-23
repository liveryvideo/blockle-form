import React, { useMemo } from 'react';

import { FormContext } from 'context';
import { createStore } from 'createStore';
import { formReducer } from 'formReducer';

type Props = {
  autocomplete?: boolean,
  children?: React.ReactNode,
  onSubmit: () => Promise<any>,
};

const Form = ({ autocomplete, children, onSubmit }: Props) => {
  const store = useMemo(
    () => createStore({}, formReducer),
    [],
  );

  const submit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

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
