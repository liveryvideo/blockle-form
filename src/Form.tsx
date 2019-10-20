import React, { useMemo, useState, useEffect } from 'react';
import { FormContext } from 'context';
import { createStore } from 'store/createStore';
import { FormReducer } from 'store/reducer';
import { FormData } from 'types';

type Props = {
  onSubmit: (formData: FormData) => void | Promise<void>;
  className?: string;
  autocomplete?: boolean;
  noValidate?: boolean;
  render: (form: { invalid: boolean; submitting: boolean }) => React.ReactNode;
}; // & React.HTMLAttributes<HTMLFormElement>;

// selectors.ts
const getFormData = (state: FormReducer) => {
  const values = Object.values(state).map(({ name, value }) => ({ name, value }));
  const formData: FormData = {};

  values.forEach(({ name, value }) => {
    formData[name] = value;
  });

  return formData;
};

const isFormInvalid = (state: FormReducer) => Object.values(state).some(({ invalid }) => invalid);

const Form = ({ render, className, autocomplete, onSubmit, noValidate = true }: Props) => {
  const store = useMemo(() => createStore(), []);
  const [submitting, setSubmitting] = useState(false);
  const [invalid, setInvalid] = useState(false);

  // Listen to store updates
  useEffect(
    () =>
      store.subscribe(() => {
        const state = store.getState();
        const isInvalid = isFormInvalid(state);

        setInvalid(isInvalid);
      }),
    [],
  );

  async function submit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const state = store.getState();
    const formData = getFormData(state);
    const isInvalid = isFormInvalid(state);

    if (isInvalid) {
      setInvalid(true);
      return;
    }

    setSubmitting(true);

    await onSubmit(formData);

    setSubmitting(false);
  }

  return (
    <FormContext.Provider value={store}>
      <form
        className={className}
        onSubmit={submit}
        autoComplete={autocomplete ? 'on' : 'off'}
        noValidate={noValidate}
      >
        {render({ submitting, invalid })}
      </form>
    </FormContext.Provider>
  );
};

export default Form;
