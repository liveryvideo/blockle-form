import { FieldState } from 'types';

export interface ActionWithPayload<T extends string, P> {
  type: T;
  payload: P;
}

export const createActionWithPayload = <T extends string, P>(
  type: T,
  payload: P,
): ActionWithPayload<T, P> => ({
  type,
  payload,
});

// Initialize field state
export const initField = <V>(
  name: string,
  state: Pick<FieldState<V>, 'value' | 'validationMessage'>,
) => createActionWithPayload('INIT', { name, state });

// Update field state
export const updateField = <V>(name: string, state: Partial<FieldState<V>>) =>
  createActionWithPayload('UPDATE_FIELD', { name, state });

// Field is touched
export const setTouched = (name: string) => createActionWithPayload('SET_TOUCHED', { name });

// Remove field state
export const removeField = (name: string) => createActionWithPayload('REMOVE_FIELD', name);

// List of actions for formReducer
export type Actions = ReturnType<
  typeof initField | typeof updateField | typeof setTouched | typeof removeField
>;
