import { FormReducer, formReducer } from './reducer';
import { Actions } from './actions';

type Listener = () => void;

export const createStore = () => {
  let currentState: FormReducer = {};
  const listeners: Listener[] = [];

  const getState = () => currentState;

  const subscribe = (listener: Listener) => {
    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);
      listeners.slice(index, 1);
    };
  };

  const dispatch = (action: Actions) => {
    currentState = formReducer(currentState, action);

    // Queue updates? With raf / empty timeout?
    listeners.forEach(listener => listener());
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
};
