import { MutableRefObject } from 'react';

export interface FormContext {
  register: (name: string, ref: MutableRefObject<any>) => () => void;
}
