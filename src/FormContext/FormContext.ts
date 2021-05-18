import { createContext } from 'react';
import { createStore } from '../store/createStore';

export const FormContext = createContext<ReturnType<typeof createStore> | null>(null);
