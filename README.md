# @blockle/form

## Install

```bash
yarn add @blockle/form
```

## Usage

```tsx
import React, { useState } from 'react';
import { Form, useField, useForm } from '@blockle/form';

interface UserForm {
  name: string;
}

const MyForm = () => {
  const form = useForm<UserForm>({
    async submit(data) {
      console.log('Form valid', data);
    },
  });

  // See form.values, form.erors

  return (
    <Form form={form}>
      <Input name="name" type="text" required />

      <button disabled={invalid || submitting}>Submit</button>
    </form>
  );
}

// Input.tsx
interface Props {
  name: string;
  value?: string;
  type: 'text' | 'password';
  required: boolean;
}

const Input: FC<Props> = ({ name, value, type, required }) => {
  const field = useField<string>({
    name,
    value,
    validate(value) {
      // Return string with "error code"
      if(required && !value.trim()) {
        return 'required';
      }

      return null;
    }
  });

  return (
    <input
      type={type}
      value={field.value}
      onChange={(event) => field.setValue(event.currentTarget.value)}
      onBlur={field.setTouched}
    />
  );
}
```
