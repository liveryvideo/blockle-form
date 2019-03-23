import { Reducer } from './createStore';

export const initialState: FormState = {};

export interface FormFieldState {
  value: any;
  focus: boolean;
  error?: string;
  dirty: boolean;
}

export interface FormState {
  [key: string]: FormFieldState;
}

type SET_VALUE = {
  type: 'SET_VALUE',
  payload: {
    name: string,
    value: any,
  },
};

type INIT = {
  type: 'INIT',
  payload: {
    name: string,
    value: any,
  },
};

type REMOVE = {
  type: 'REMOVE',
  payload: {
    name: string,
  },
};

export type Actions = SET_VALUE | INIT | REMOVE;

export const formReducer: Reducer<FormState, Actions> = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        [action.payload.name]: {
          value: action.payload.value,
          ...state[action.payload.name],
        },
      };

    case 'REMOVE':
      const nextState = { ...state };

      delete nextState[action.payload.name];

      return nextState;

    case 'SET_VALUE':
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          value: action.payload.value,
        },
      };

    default:
      throw new Error();
  }
};
