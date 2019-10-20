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
          touched: false,
          validationMessage: action.payload.state.validationMessage,
          value: action.payload.state.value,
        },
      };

    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          ...action.payload.state,
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

    case 'REMOVE_FIELD':
      const nextState = { ...state };

      delete nextState[action.payload];

      return nextState;

    default:
      return state;
  }
};
