import React, { useMemo, useState, useEffect } from 'react';

import { FormContext } from './context';
import { createStore } from './store/createStore';
import { FormData } from './types';
import { isFormInvalid, getFormData } from './store/selectors';
import { setTouchedAll } from './store/actions';

type Props = {
  onSubmit: (formData: FormData) => void | Promise<void>;
  className?: string;
  autocomplete?: boolean;
  noValidate?: boolean;
  render: (form: { invalid: boolean; submitting: boolean }) => React.ReactNode;
}; // & React.HTMLAttributes<HTMLFormElement>;

const Form = ({ render, className, autocomplete, onSubmit, noValidate = true }: Props) => {
  const store = useMemo(() => createStore(), []);
  const [submitting, setSubmitting] = useState(false);
  const [invalid, setInvalid] = useState(false);

  // Listen to store updates to set validity
  useEffect(() => {
    const listener = () => {
      const state = store.getState();
      const isInvalid = isFormInvalid(state);

      setInvalid(isInvalid);
    };

    listener();

    return store.subscribe(() => listener());
  }, []);

  function submit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    // Set all fields to touched to display errors
    store.dispatch(setTouchedAll());

    const state = store.getState();
    const formData = getFormData(state);
    const isInvalid = isFormInvalid(state);

    if (isInvalid) {
      setInvalid(true);
      return;
    }

    setSubmitting(true);

    const result = onSubmit(formData);

    // TODO Use await and ship without polyfill?
    if (result && result.then) {
      result.then(() => setSubmitting(false));
    } else {
      setSubmitting(false);
    }
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
