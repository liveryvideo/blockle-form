import React, { useMemo } from 'react';

import { FormContext } from 'context';
import { createStore } from 'store/createStore';
import { FormState, reducer } from 'store/reducer';
import { getValueMap, isValid } from 'store/selectors';
import { ValueMap } from 'types';

type Props = {
  autocomplete?: boolean,
  children?: React.ReactNode,
  onSubmit: (values: ValueMap) => Promise<any>,
};

const Form = ({ autocomplete, children, onSubmit }: Props) => {
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

    console.log('Form submit', getValueMap(state));
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
