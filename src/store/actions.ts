/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const createAction = <Type extends string>(type: Type) => ({
  type,
});

export const createActionWithPayload = <Type extends string, Payload>(
  type: Type,
  payload: Payload,
) => ({
  type,
  payload,
});

export const init = () => createAction('INIT');

export const setFormSubmitting = (submitting: boolean) =>
  createActionWithPayload('SET_FORM_SUBMITTING', submitting);

export const setFormTouched = () => createAction('SET_FORM_TOUCHED');

export const initField = (
  name: string,
  value: unknown,
  validator: (value: any) => string | null = () => null,
) => createActionWithPayload('INIT_FIELD', { name, value, validator });

export const removeField = (name: string) => createActionWithPayload('REMOVE_FIELD', name);

export const setFieldTouched = (name: string) => createActionWithPayload('SET_FIELD_TOUCHED', name);

export const updateField = (name: string, value: unknown) =>
  createActionWithPayload('UPDATE_FIELD', { name, value });

export type Actions = ReturnType<
  | typeof init
  | typeof initField
  | typeof removeField
  | typeof setFieldTouched
  | typeof setFormSubmitting
  | typeof setFormTouched
  | typeof updateField
>;
