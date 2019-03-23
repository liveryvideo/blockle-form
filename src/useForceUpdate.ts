import { useReducer } from 'react';

export const useForceUpdate = () => useReducer(state => state + 1, 0)[1] as Function;
