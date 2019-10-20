import { FormReducer } from './reducer';
import { FormData } from './../types';

export const getFormData = (state: FormReducer) => {
  const values = Object.values(state).map(({ name, value }) => ({ name, value }));
  const formData: FormData = {};

  values.forEach(({ name, value }) => {
    formData[name] = value;
  });

  return formData;
};

export const isFormInvalid = (state: FormReducer) =>
  Object.values(state).some(({ validationMessage }) => validationMessage !== null);
