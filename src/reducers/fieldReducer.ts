import { Dispatch } from 'react';

interface FieldReducer<V = any> {
  dirty: boolean;
  invalid: boolean;
  touched: boolean;
  validationMessage: string;
  value: V;
}

const initialState: FieldReducer = {
  dirty: false,
  invalid: false,
  touched: false,
  validationMessage: '',
  value: null,
};

export const createInitialState = <V>(value: V) => ({
  dirty: false,
  invalid: false,
  touched: false,
  validationMessage: '',
  value,
});

export const fieldReducer = (
  state = initialState,
  action: Actions,
): FieldReducer => {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        value: action.payload,
      };
  }
};

// -- ACTIONS --
const setValue = <V>(value: V) => ({
  type: 'SET_VALUE' as const,
  payload: value,
});

export type Actions = ReturnType<typeof setValue>;

export const createFieldActions = (dispatch: Dispatch<Actions>) => ({
  setValue<V>(value: V) {
    dispatch(setValue(value));
  },
});
