import React from 'react';

import { Store } from 'store/createStore';
import { Actions } from 'store/actions';
import { FormState } from 'types';

export type IFormContext = Store<FormState, Actions>;

export const FormContext = React.createContext<IFormContext>(null as any);
