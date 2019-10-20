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
      listeners.splice(index, 1);
    };
  };

  const dispatch = (action: Actions) => {
    currentState = formReducer(currentState, action);

    listeners.forEach(listener => listener());
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
};
