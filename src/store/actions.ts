import { Action, ActionWithPayload } from './createStore';
import { FormField } from './reducer';

export const createAction = <T extends string>(type: T) => (): Action<T> => ({
  type,
});

export const createActionWithPayload = <T extends string, P>(type: T) => (payload: P): ActionWithPayload<T, P> => ({
  type,
  payload,
});

export const UPDATE_FIELD = 'UPDATE_FIELD';
export const updateField = createActionWithPayload<typeof UPDATE_FIELD, FormField>(UPDATE_FIELD);

type Remove = {
  name: string;
};

export const REMOVE = 'REMOVE';
export const remove = createActionWithPayload<typeof REMOVE, Remove>(REMOVE);

export type Actions = ReturnType<typeof updateField> | ReturnType<typeof remove>;
