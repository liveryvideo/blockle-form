import { Actions } from './actions';
import { FieldState } from 'types';

export type FormReducer = {
  [type: string]: FieldState<unknown>;
};

const initialState: FormReducer = {};

export const formReducer = (state = initialState, action: Actions): FormReducer => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        [action.payload.name]: {
          name: action.payload.name,
          dirty: false,
          invalid: false,
          touched: false,
          validationMessage: null,
          value: action.payload.value,
        },
      };

    case 'SET_VALUE':
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          value: action.payload.value,
        },
      };

    case 'SET_TOUCHED':
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          touched: true,
        },
      };

    case 'SET_VALIDITY':
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          validationMessage: action.payload.validationMessage,
          invalid: action.payload.validationMessage !== null,
        },
      };

    default:
      return state;
  }
};
