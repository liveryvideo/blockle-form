import React, { useMemo } from 'react';

import { FormContext } from 'context';
import { createStore } from 'store/createStore';
import { reducer } from 'store/reducer';
import { getValueMap, isValid } from 'store/selectors';
import { ValueMap, FormState } from 'types';

type Props = {
  autocomplete?: boolean,
  children?: React.ReactNode,
  onSubmit: (values: ValueMap) => void,
  id?: string,
};

const Form = ({ autocomplete, children, onSubmit, id }: Props) => {
  const store = useMemo(
    () => createStore<FormState>(reducer),
    [],
  );

  const submit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const state = store.getState();

    if (!isValid(state)) {
      return console.log('Form invalid');
    }

    onSubmit(getValueMap(state));

    console.log('Form submit', getValueMap(state));
  };

  return (
    <FormContext.Provider value={store}>
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
