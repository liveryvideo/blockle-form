import React from 'react';
import { FormContext } from 'context';
import { FormContext as Context } from 'types';

interface Props {
  children: React.ReactNode;
  className?: string;
  onSubmit: (formData: FormData) => void;
}

const Form = ({ children, className }: Props) => {
  // Create mutatable state
  // const state = useMemo(() => [], []);
  const context: Context = {
    register(name, ref) {
      // console.log('register');
      console.log(name, ref);

      return () => {
        // console.log('unregister');
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
