import { Reducer } from './createStore';
import { Actions } from './actions';

export const initialState: FormState = {};

export interface FormField {
  name: string;
  value?: any;
  invalid?: null | string;
  dirty?: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

export const reducer: Reducer<FormState, Actions> = (state, action): FormState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          ...action.payload,
        },
      };

    case 'REMOVE':
      const nextState = { ...state };

      delete nextState[action.payload.name];

      return nextState;

    default:
      // @ts-ignore
      throw new Error(`Unkown action type "${action.type}"`);
  }
};
