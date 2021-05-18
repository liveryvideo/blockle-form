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

export const initField = (name: string, value: unknown) =>
  createActionWithPayload('INIT_FIELD', { name, value });

export const removeField = (name: string) => createActionWithPayload('REMOVE_FIELD', name);

export const setFieldTouched = (name: string) => createActionWithPayload('SET_FIELD_TOUCHED', name);

export const updateField = (name: string, details: { value: unknown; error: string | null }) =>
  createActionWithPayload('UPDATE_FIELD', { name, details });

export type Actions = ReturnType<
  | typeof init
  | typeof setFormSubmitting
  | typeof setFormTouched
  | typeof initField
  | typeof removeField
  | typeof setFieldTouched
  | typeof updateField
>;
