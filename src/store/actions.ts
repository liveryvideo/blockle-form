import { FieldState } from 'types';

export interface Action<T extends string> {
  type: T;
}

export interface ActionWithPayload<T extends string, P> extends Action<T> {
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

export const init = (name: string, value: string) =>
  createActionWithPayload('INIT', { name, value });

export const setValue = (name: string, value: string) =>
  createActionWithPayload('SET_VALUE', { name, value });

export const setTouched = (name: string) => createActionWithPayload('SET_TOUCHED', { name });

export const setValidity = (name: string, validationMessage: FieldState['validationMessage']) =>
  createActionWithPayload('SET_VALIDITY', { name, validationMessage });

export const setDirty = (name: string, dirty: FieldState['dirty']) =>
  createActionWithPayload('SET_DIRTY', { name, dirty });

export type Actions = ReturnType<
  typeof init | typeof setValue | typeof setTouched | typeof setValidity | typeof setDirty
>;
