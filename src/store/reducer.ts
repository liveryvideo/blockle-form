import { Actions } from './actions';

interface FieldState {
  dirty: boolean;
  error: string | null;
  name: string;
  touched: boolean;
  value: unknown;
  initialValue: unknown;
  validator: (value: unknown) => string | null;
}

export interface FormReducer {
  submitting: boolean;
  fields: Record<string, FieldState>;
}

const initialState: FormReducer = {
  submitting: false,
  fields: {},
};

export function reducer(state = initialState, action: Actions): FormReducer {
  switch (action.type) {
    case 'SET_FORM_TOUCHED': {
      const fields = Object.entries(state.fields).map(([name, data]) => {
        return [name, { ...data, touched: true }];
      });

      return {
        ...state,
        fields: Object.fromEntries(fields),
      };
    }

    case 'SET_FORM_SUBMITTING':
      return {
        ...state,
        submitting: action.payload,
      };

    case 'INIT_FIELD':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.name]: {
            ...action.payload,
            dirty: false,
            error: null,
            touched: false,
            initialValue: action.payload.value,
          },
        },
      };

    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.name]: {
            ...state.fields[action.payload.name],
            value: action.payload.value,
            error: state.fields[action.payload.name].validator(action.payload.value),
            dirty: action.payload.value !== state.fields[action.payload.name].initialValue,
          },
        },
      };

    case 'REMOVE_FIELD': {
      const nextState = { ...state, fields: { ...state.fields } };

      delete nextState.fields[action.payload];

      return nextState;
    }

    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload]: {
            ...state.fields[action.payload],
            touched: true,
          },
        },
      };

    default:
      return state;
  }
}
