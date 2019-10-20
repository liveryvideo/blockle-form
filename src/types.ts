export type FieldState = {
  name: string;
  dirty: boolean;
  invalid: boolean;
  touched: boolean;
  validationMessage: null | string;
  value: string;
};
