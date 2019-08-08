import React, { MutableRefObject } from 'react';

import { ValidationErrors } from 'types';
import { Listener } from 'Form';

export interface Context {
  register: (ref: MutableRefObject<any>) => () => void;
  dispatchError: (name: string, error: ValidationErrors) =>  void;
  onFieldError: (listener: Listener) => () => void;
}

export const FormContext = React.createContext<Context>(null as any);
