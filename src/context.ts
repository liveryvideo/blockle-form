import React, { MutableRefObject } from 'react';

// export type IFormContext = Store<FormState, Actions>;
export interface Context {
  register: (ref: MutableRefObject<any>) => () => void;
}

export const FormContext = React.createContext<Context>(null as any);
