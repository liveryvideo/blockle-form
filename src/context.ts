import React from 'react';

import { Store } from 'createStore';

export type IFormContext = Store<any, any>;

export const FormContext = React.createContext<IFormContext>(null as any);
