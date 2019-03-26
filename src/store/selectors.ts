import { FormState } from './reducer';

export const getField = (state: FormState, name: string) =>
  state[name];

export const getFields = (state: FormState) =>
  Object.values(state);

export const getValueMap = (state: FormState) => {
  const map: { [key: string]: any } = {};

  getFields(state).forEach(({ name, value }) => {
    map[name] = value;
  });

  return map;
};

export const isValid = (state: FormState) => {
  const fields = getFields(state);
  let valid = true;

  fields.forEach((field) => {
    if (field.invalid) {
      valid = false;
    }
  });

  return valid;
};
