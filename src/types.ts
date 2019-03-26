export type FormElementState = {
  focus: boolean,
  name: string,
  touched: boolean,
  valid: boolean,
  value: any,
};

export type FormElementProps<V = any> = {
  name: string,
  value?: V,
  required?: boolean,
};

export type ValueMap = {
  [key: string]: any;
};
