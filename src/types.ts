import { MutableRefObject } from 'react';

export type FormFieldListener = (name: string, state: FormFieldState) => void;

export interface BaseFieldProps<V> {
  name: string;
  value?: V;
}

interface Register {
  name: string;
  stateRef: MutableRefObject<any>;
  validate: () => boolean;
}

export interface FormContext {
  // register: (name: string, ref: MutableRefObject<any>) => () => void;
  register: (config: Register) => () => void;
  subscribe: (listener: FormFieldListener) => void;
  notify: (name: string, state: FormFieldState) => void;
}

export interface FormFieldState {
  dirty: boolean;
  invalid: boolean;
  touched: boolean;
  validationMessage: string;
  value: any;
}

export interface FormData {
  [key: string]: any;
}
