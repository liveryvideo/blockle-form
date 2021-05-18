import { Actions } from './actions';
import { FormReducer, reducer } from './reducer';

type Listener = () => void;

export function createStore() {
  let currentState: FormReducer = reducer(undefined, { type: 'INIT' });
  const listeners: Listener[] = [];

  return {
    getState() {
      return currentState;
    },
    dispatch(action: Actions) {
      currentState = reducer(currentState, action);

      listeners.forEach((listener) => listener());
    },
    subscribe(listener: Listener) {
      listeners.push(listener);

      return function unsubscribe() {
        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    },
  };
}
