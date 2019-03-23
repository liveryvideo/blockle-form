import { useReducer } from 'react';

export const useForceUpdate = () => useReducer(state => !state, false)[1] as Function;
