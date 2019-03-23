import { Reducer } from './createStore';

export const initialState: FormState = {};

export interface FormFieldState {
  name: string;
  value: any;
  invalid: null | string;
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
    invalid: null | string,
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

export const formReducer: Reducer<FormState, Actions> = (state, action): FormState => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        [action.payload.name]: {
          name: action.payload.name,
          value: action.payload.value,
          invalid: null,
          dirty: false,
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
          invalid: action.payload.invalid,
        },
      };

    default:
      // @ts-ignore
      throw new Error(`Unkown action type "${action.type}"`);
  }
};
