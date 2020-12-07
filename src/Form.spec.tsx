import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { FieldProps, Form } from '.';
import { useField } from './useField';

afterEach(cleanup);

type InputProps = {
  required?: boolean;
  placeholder: string;
} & FieldProps<string>;

const Input = ({ name, required, value, placeholder }: InputProps) => {
  const field = useField<string>(name, {
    value: value || '',
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
    const { container } = render(
      <Form
        onSubmit={() => {}}
        render={({ invalid, submitting }) => (
          <>
            <Input name="npt" placeholder="name" />
            <button type="submit" disabled={invalid || submitting}>
              submit
            </button>
          </>
        )}
      />,
    );

    expect(container).toHaveTextContent('submit');
  });

  it('should submit', async () => {
    const spy = jest.fn();
    const { findByText } = render(
      <Form
        onSubmit={spy}
        render={({ invalid, submitting }) => (
          <>
            <Input name="npt" value="test" placeholder="name" />
            <button type="submit" disabled={invalid || submitting}>
              submit
            </button>
          </>
        )}
      />,
    );

    const button = await findByText('submit');

    fireEvent.click(button);

    expect(spy).toBeCalledWith({
      npt: 'test',
    });
  });

  it('should not submit when form is invalid', async () => {
    const spy = jest.fn();
    const { findByText } = render(
      <Form
        onSubmit={spy}
        render={() => (
          <>
            <Input name="npt" required placeholder="name" />
            <button type="submit">submit</button>
          </>
        )}
      />,
    );

    const button = await findByText('submit');

    fireEvent.click(button);

    expect(spy).not.toBeCalled();
  });

  it('should update form validity', async () => {
    const spy = jest.fn();
    const { findByText } = render(
      <Form
        onSubmit={spy}
        render={({ invalid }) => (
          <>
            <Input name="npt" required placeholder="name" />
            <button type="submit" disabled={invalid}>
              submit
            </button>
          </>
        )}
      />,
    );

    const button = await findByText('submit');

    fireEvent.click(button);

    expect(spy).not.toBeCalledTimes(1);
  });

  it('should update value and validity', async () => {
    const spy = jest.fn();
    const { findByText, findByPlaceholderText } = render(
      <Form
        onSubmit={spy}
        render={({ invalid, submitting }) => (
          <>
            <Input name="npt" placeholder="name" required />
            <button type="submit" disabled={invalid || submitting}>
              submit
            </button>
          </>
        )}
      />,
    );

    const button = await findByText('submit');
    const input = await findByPlaceholderText('name');

    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: 'myName' } });

    expect(button).toBeEnabled();
    expect(input).toHaveValue('myName');
  });

  it('should update value from prop', async () => {
    const spy = jest.fn();
    const { rerender, findByPlaceholderText } = render(
      <Form
        onSubmit={spy}
        render={({ invalid, submitting }) => (
          <>
            <Input name="npt" placeholder="name" required />
            <button type="submit" disabled={invalid || submitting}>
              submit
            </button>
          </>
        )}
      />,
    );

    rerender(
      <Form
        onSubmit={spy}
        render={({ invalid, submitting }) => (
          <>
            <Input name="npt" value="Barros" placeholder="name" required />
            <button type="submit" disabled={invalid || submitting}>
              submit
            </button>
          </>
        )}
      />,
    );

    const input = await findByPlaceholderText('name');

    expect(input).toHaveValue('Barros');
  });

  it('should display field error when touched', async () => {
    const spy = jest.fn();
    const { getByText, findByPlaceholderText } = render(
      <Form
        onSubmit={spy}
        render={({ invalid, submitting }) => (
          <>
            <Input name="npt" placeholder="name" required />
            <button type="submit" disabled={invalid || submitting}>
              submit
            </button>
          </>
        )}
      />,
    );

    const input = await findByPlaceholderText('name');

    fireEvent.blur(input);

    expect(getByText('INVALID')).toBeTruthy();
  });

  it('should handle async submit action', async () => {
    jest.useFakeTimers();

    const { getByText } = render(
      <Form
        onSubmit={() => new Promise((resolve) => setTimeout(resolve, 200))}
        render={({ submitting }) => (
          <>
            <Input name="npt" placeholder="name" value="test" />
            <button type="submit" disabled={submitting}>
              submit
            </button>
          </>
        )}
      />,
    );

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
