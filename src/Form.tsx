import React, { useMemo, useState, useEffect } from 'react';
import { FormContext } from 'context';
import { createStore } from 'store/createStore';
import { FormReducer } from 'store/reducer';

type Props = {
  onSubmit: (formData: any) => void | Promise<void>;
  className?: string;
  autocomplete?: boolean;
  noValidate?: boolean;
  render: (form: { valid: boolean; submitting: boolean }) => React.ReactNode;
}; // & React.HTMLAttributes<HTMLFormElement>;

// selectors.ts
const getFormData = (state: FormReducer) =>
  Object.values(state).map(({ name, value }) => ({ name, value }));

const isFormInvalid = (state: FormReducer) => Object.values(state).some(({ invalid }) => invalid);

const Form = ({ render, className, autocomplete, onSubmit, noValidate }: Props) => {
  const store = useMemo(() => createStore(), []);
  const [submitting, setSubmitting] = useState(false);
  const [valid, setValid] = useState(false);

  // Listen to store updates
  useEffect(
    () =>
      store.subscribe(() => {
        const state = store.getState();
        const isInvalid = isFormInvalid(state);

        setValid(!isInvalid);
      }),
    [],
  );

  async function submit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const state = store.getState();
    const formData = getFormData(state);
    const isInvalid = isFormInvalid(state);

    if (isInvalid) {
      setValid(false);
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
        {render({ submitting, valid })}
      </form>
    </FormContext.Provider>
  );
};

export default Form;
