type Payload = {
  [key: string]: undefined | boolean | string,
};

type Action = {
  type: string
  payload?: Payload,
};

type Listener<S> = (state: S, currentState: S) => void;

export type Reducer<S, A extends Action> = (state: S, action: A) => S;

export type Store<S, A extends Action> = {
  dispatch: (action: A) => void,
  getState: () => S,
  subscribe: (listener: Listener<S>) => () => void,
};

export const createStore = <S, A extends Action = Action>(initialState: S, reducer: Reducer<any, any>) => {
  const listeners: Listener<S>[] = [];
  let currentState = initialState;

  function dispatch(action: A) {
    const prevState = currentState;

    currentState = reducer(currentState, action);

    listeners.forEach(listener => listener(currentState, prevState));
  }

  function getState() {
    return currentState;
  }

  function subscribe(listener: Listener<S>) {
    listeners.push(listener);

    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  return {
    dispatch,
    getState,
    subscribe,
  };
};
