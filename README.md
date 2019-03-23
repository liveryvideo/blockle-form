# @blockle/form

```jsx
import { Form, FormError } from '@blockle/form';
import Input from 'myComponents/Input';

const submit = () =>
  new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

const MyForm = () => {
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <Form
      onSubmit={submit}
    >
      <Input
        type="text"
        name="name"
        required
      />

      <VegetableSelect name="vegetable" required />

      <FormError
        render={(errors) => {
          if(errors.length) {
            return JSON.stringify(errors);
          }

          return null;
        }}
      >

      <submit type="submit" value="send" />
    </Form>
  );
}
```

## Custom form components

```tsx
import { useForm } from '@blockle/form';

type Props = FormElementProps<string>;

export const VegetableSelect = ({ name, value }) => {
  const { value, setValue } = useForm(name, value);

  return (
    <div>
      <button
        onClick={() => setValue('artichokes')}
        className={value === 'artichokes' ? 'selected' : ''}
      >
        Artichokes
      </button>
      <button
        onClick={() => setValue('broccoli')}
        className={value === 'broccoli' ? 'selected' : ''}
      >
        Broccoli
      </button>
      <button
        onClick={() => setValue('carrots')}
        className={value === 'carrots' ? 'selected' : ''}
      >
        Carrots
      </button>
    </div>
  )
}
```
