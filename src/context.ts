import React from 'react';

import { Store } from 'createStore';
import { FormState, Actions } from 'formReducer';

export type IFormContext = Store<FormState, Actions>;

export const FormContext = React.createContext<IFormContext>(null as any);
