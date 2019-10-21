export type FieldState<V> = {
  name: string;
  dirty: boolean;
  touched: boolean;
  validationMessage: null | string;
  value: V;
};

export type FieldProps<V> = {
  name: string;
  value?: V;
};

export type FormData = any;
