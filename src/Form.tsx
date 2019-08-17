import React, { useMemo, MutableRefObject } from 'react';
import { FormContext } from 'context';
import { FormContext as Context, FormFieldListener, FormData } from 'types';

interface Props {
  autocomplete?: boolean;
  children: React.ReactNode;
  className?: string;
  noValidate?: boolean;
  onSubmit: (formData: FormData) => void;
}

const Form = ({
  autocomplete,
  children,
  className,
  noValidate = true,
  onSubmit,
}: Props) => {
  // Create mutatable state
  const state = useMemo(
    () => new Map<string, [MutableRefObject<any>, () => boolean]>(),
    [],
  );
  const listeners: FormFieldListener[] = useMemo(() => [], []);
  const context: Context = {
    register({ name, stateRef, validate }) {
      state.set(name, [stateRef, validate]);

      return () => {
        state.delete(name);
      };
    },
    subscribe(listener) {
      listeners.push(listener);

      return () => {
        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    },
    notify(name, state) {
      listeners.forEach(listener => listener(name, state));
    },
  };

  const submit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    let isValid = true;

    event.preventDefault();

    state.forEach(([, validate]) => {
      if (!validate()) {
        isValid = false;
      }
    });

    if (!isValid) {
      console.log('Form invalid');
      return;
    }

    const formData: FormData = {};

    state.forEach(([stateRef], name) => {
      formData[name] = stateRef.current.value;
    });

    onSubmit(formData);
  };

  return (
    <FormContext.Provider value={context}>
      <form
        className={className}
        onSubmit={submit}
        autoComplete={autocomplete ? 'on' : 'off'}
        noValidate={noValidate}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

export default Form;
