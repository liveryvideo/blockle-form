# @blockle/form

## Install

```bash
yarn add @blockle/form
```

## Usage

```tsx
import React, { useState } from 'react';
import { Form, useField, FieldProps } from '@blockle/form';

interface FormData {
  name: string;
}

const MyForm = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const submit = async (formData: FormData) => {
    try {
      await xhr.send(formData);
    } catch(error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <Form
      onSubmit={submit}
      render={({ invalid, submitting }) => (
        <Input name="name" type="text" required />

        {errorMessage
          && <div>{errorMessage}</div>}

        <button disabled={invalid || submitting}>Submit</button>
      )}
    />
  );
}

// Input.tsx
interface InputProps extends FieldProps<string> {
  type: 'text' | 'password';
  required: boolean;
}

const Input = ({ name, value, type, required }: InputProps) => {
  const field = useField<string>(name, {
    value,
    validate(value) {
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
      onFocus={field.setTouched}
    />
  );
}
```
