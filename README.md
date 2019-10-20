# @blockle/form

## Install

```bash
yarn add @blockle/form
```

## Usage

```tsx
import React, { useState } from 'react';
import Form, { BaseFieldProps } from '@blockle/form';

interface FormData {
  name: string;
}

const MyForm = () => {
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const submit = async (formData: FormData) => {
    setSending(true);

    try {
      await xhr.send(formData);
    } catch(error) {
      setErrorMessage(error.message);
    }

    setSending(false);
  }

  return (
    <Form onSubmit={submit}>
      <Input name="name" type="text" required />
      <ValidationWarning target="name" />

      <button disabled={sending}>Submit</button>
    </Form>
  );
}

interface InputProps extends BaseFieldProps<string> {
  type: 'text' | 'password';
  required: boolean;
}

// --
const Input = ({ name, value, type, required }: InputProps) => {
  const {value, touched, dirty, valid, validationMessage, setValue, setTouched} = useForm({
    name,
    value,
    validate(value) {
      if(required && !value.trim()) {
        return 'required';
      }

      return null;
    },
    computeValue(value) {
      return value;
    }
  });

  // Update value

  return (<input type={type} value={value} onInput={(event) => setValue(event.currentTarget.value)} onFocus={setTouched} />);
}

interface ValidationWarningProps {
  target: string;
}

// --
const ValidationWarning = ({ target }: ValidationWarningProps) => {
  const { value, touched, dirty, valid, validationMessage } = useFormField(target);

  if(valid) {
    return null;
  }

  return <div>{validationMessage}</div>
}
```

```ts
interface BaseFieldProps<V> {
  value: V;
  name: string;
}
```
