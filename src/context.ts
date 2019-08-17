import React from 'react';

import { FormContext as Context } from 'types';

export const FormContext = React.createContext<Context>({
  register: () => {
    throw new Error('Forgot to wrap form element in <Form /> component?');
  },
  subscribe: () => {
    throw new Error('Forgot to wrap form element in <Form /> component?');
  },
  notify: () => {
    throw new Error('Forgot to wrap form element in <Form /> component?');
  },
});
