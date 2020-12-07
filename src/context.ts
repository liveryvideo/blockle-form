import React from 'react';
import { createStore } from './store/createStore';

export const FormContext = React.createContext<ReturnType<typeof createStore> | null>(null);
