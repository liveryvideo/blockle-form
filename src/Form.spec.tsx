import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, render } from '@testing-library/react';
import React, { FC } from 'react';
import { Form, useField, useForm } from '.';

afterEach(cleanup);

interface InputProps {
  name: string;
  value?: string;
  required?: boolean;
  placeholder: string;
}

const Input: FC<InputProps> = ({ name, required, value = '', placeholder }) => {
  const field = useField<string>({
    name,
    value: value,
    validate(value) {
      if (required && !value.trim()) {
        return 'required';
      }

      return null;
    },
  });

  return (
    <div>
      <input
        type="text"
        name={name}
        value={field.value}
        onChange={(e) => field.setValue(e.target.value)}
        placeholder={placeholder}
        onBlur={field.setTouched}
      />
      {field.invalid && field.touched && <div>INVALID</div>}
    </div>
  );
};

describe('Form', () => {
  it('should render Input', () => {
    const Test: FC = () => {
      const form = useForm({
        submit() {},
      });

      return (
        <Form form={form}>
          <Input name="npt" placeholder="name" />
          <button type="submit" disabled={form.invalid || form.submitting}>
            submit
          </button>
        </Form>
      );
    };

    const { container } = render(<Test />);

    expect(container).toHaveTextContent('submit');
  });

  it('should submit', async () => {
    const spy = jest.fn();
    const Test: FC = () => {
      const form = useForm({
        submit: spy,
      });

      return (
        <Form form={form}>
          <Input name="npt" value="test" placeholder="name" />
          <button type="submit" disabled={form.invalid || form.submitting}>
            submit
          </button>
        </Form>
      );
    };

    const { findByText } = render(<Test />);

    const button = await findByText('submit');

    fireEvent.click(button);

    expect(spy).toBeCalledWith({
      npt: 'test',
    });
  });

  it('should not submit when form is invalid', async () => {
    const spy = jest.fn();
    const Test: FC = () => {
      const form = useForm({
        submit: spy,
      });

      return (
        <Form form={form}>
          <Input name="npt" required placeholder="name" />
          <button type="submit">submit</button>
        </Form>
      );
    };

    const { findByText } = render(<Test />);

    const button = await findByText('submit');

    fireEvent.click(button);

    expect(spy).not.toBeCalled();
  });

  it('should update value and validity', async () => {
    const spy = jest.fn();
    const Test: FC = () => {
      const form = useForm({
        submit: spy,
      });

      return (
        <Form form={form}>
          <Input name="npt" placeholder="name" required />
          <button type="submit" disabled={form.invalid || form.submitting}>
            submit
          </button>
        </Form>
      );
    };

    const { findByText, findByPlaceholderText } = render(<Test />);

    const button = await findByText('submit');
    const input = await findByPlaceholderText('name');

    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: 'myName' } });

    expect(button).toBeEnabled();
    expect(input).toHaveValue('myName');
  });

  it('should update value from prop', async () => {
    const spy = jest.fn();
    const Test: FC<{ value?: string }> = ({ value }) => {
      const form = useForm({
        submit: spy,
      });

      return (
        <Form form={form}>
          <Input name="npt" value={value} placeholder="name" required />
          <button type="submit" disabled={form.invalid || form.submitting}>
            submit
          </button>
        </Form>
      );
    };

    const { rerender, findByPlaceholderText } = render(<Test />);

    rerender(<Test value="Barros" />);

    const input = await findByPlaceholderText('name');

    expect(input).toHaveValue('Barros');
  });

  it('should display field error when touched', async () => {
    const spy = jest.fn();
    const Test: FC = () => {
      const form = useForm({
        submit: spy,
      });

      return (
        <Form form={form}>
          <Input name="npt" placeholder="name" required />
          <button type="submit" disabled={form.invalid || form.submitting}>
            submit
          </button>
        </Form>
      );
    };

    const { getByText, findByPlaceholderText } = render(<Test />);

    const input = await findByPlaceholderText('name');

    fireEvent.blur(input);

    expect(getByText('INVALID')).toBeTruthy();
  });

  it('should handle async submit action', async () => {
    jest.useFakeTimers();

    const Test: FC = () => {
      const form = useForm({
        submit: () => new Promise((resolve) => setTimeout(resolve, 200)),
      });

      return (
        <Form form={form}>
          <Input name="npt" placeholder="name" value="test" />
          <button type="submit" disabled={form.submitting}>
            submit
          </button>
        </Form>
      );
    };

    const { getByText } = render(<Test />);

    const button = getByText('submit');

    expect(button).toBeEnabled();

    // Submit
    fireEvent.click(button);

    // Submit should be disabled when called with async callback
    expect(button).toBeDisabled();

    jest.runAllImmediates();

    // Submit is enabled again when callback finished
    expect(button).toBeDisabled();
  });

  // it should remove unmounted field from store

  // it should show field errors by pressing submit
});
