import { Reducer } from './createStore';
import { Actions } from './actions';
import { FormState } from '../types';

export const initialState: FormState = {};

export const reducer: Reducer<FormState, Actions> = (state, action): FormState => {
  switch (action.type) {
    // TODO SET_VALUE
    case 'UPDATE_FIELD': {
      const { name } = action.payload;
      // const errors = action.payload.errors || state[name].errors || {};

      return {
        ...state,
        [name]: {
          ...state[name],
          ...action.payload,
          // invalid: !!Object.keys(errors).length,
        },
      };
    }

    case 'SET_VALUE': {
      const { name, value, errors } = action.payload;

      return {
        ...state,
        [name]: {
          ...state[name],
          name,
          value,
          errors,
          invalid: errors ? !!Object.keys(errors).length : false,
        },
      };
    }

    case 'REMOVE':
      const nextState = { ...state };

      delete nextState[action.payload.name];

      return nextState;

    default:
      // @ts-ignore
      throw new Error(`Unkown action type "${action.type}"`);
  }
};
