import React from 'react';

import { Store } from 'store/createStore';
import { FormState } from 'store/reducer';
import { Actions } from 'store/actions';

export type IFormContext = Store<FormState, Actions>;

export const FormContext = React.createContext<IFormContext>(null as any);
