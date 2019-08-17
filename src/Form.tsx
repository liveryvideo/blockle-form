import React, { useMemo, MutableRefObject } from 'react';
import { FormContext } from 'context';
import { FormContext as Context } from 'types';

interface Props {
  children: React.ReactNode;
  className?: string;
  onSubmit: (formData: FormData) => void;
}

const Form = ({ children, className }: Props) => {
  // Create mutatable state
  const state = useMemo(() => new Map<string, MutableRefObject<any>>(), []);
  const context: Context = {
    register(name, ref) {
      state.set(name, ref);

      return () => {
        state.delete(name);
      };
    },
  };

  return (
    <FormContext.Provider value={context}>
      <form className={className}>{children}</form>
    </FormContext.Provider>
  );
};

export default Form;
