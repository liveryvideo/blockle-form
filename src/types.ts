export type FormElementState = {
  focus: boolean,
  name: string,
  touched: boolean,
  valid: boolean,
  value: any,
};

export type FieldProps<V = any> = {
  name: string,
  value?: V,
  required?: boolean,
};

export type FormData = {
  [key: string]: any;
};

export type ValidationErrors = null | {
  [key: string]: true;
};

export type FormField = {
  name: string,
  value: any,
  valid?: boolean,
  // disabled?: boolean,
  errors?: ValidationErrors,
  dirty?: boolean,
  touched?: boolean,
  computeValue?: (value: any) => any,
};

export type FormState = {
  [key: string]: FormField;
};
