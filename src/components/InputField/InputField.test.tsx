// src/components/InputField/InputField.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputField } from './InputField';

describe('InputField', () => {
  it('renders label and placeholder', () => {
    render(<InputField label="Username" placeholder="Enter username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('calls onChange when text is entered', () => {
    const handleChange = vi.fn();
    render(<InputField label="Name" onChange={handleChange} />);
    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'John Doe' } });
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('John Doe');
  });

  it('shows helperText and links aria-describedby to helper', () => {
    render(
      <InputField
        label="Email"
        helperText="We will never share your email."
        value=""
      />
    );
    const input = screen.getByLabelText('Email');
    const helper = screen.getByText(/never share/i);
    expect(helper).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', helper.id);
  });

  it('shows errorMessage and sets aria-invalid', () => {
    render(
      <InputField
        label="User"
        errorMessage="Name is required"
        invalid
        value=""
      />
    );
    const input = screen.getByLabelText('User');
    const errorMsg = screen.getByText('Name is required');
    expect(errorMsg).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', errorMsg.id);
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <InputField label="Disabled" disabled value="Readonly" />
    );
    const input = screen.getByLabelText('Disabled') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('shows loading spinner and sets aria-busy', () => {
    render(
      <InputField label="Loading" loading value="wait..." />
    );
    const input = screen.getByLabelText('Loading');
    expect(input).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('can clear the input with clear button', () => {
    const handleChange = vi.fn();
    render(
      <InputField
        label="ClearMe"
        value="test"
        clearable
        onChange={handleChange}
      />
    );
    const input = screen.getByLabelText('ClearMe');
    expect(input).toHaveValue('test');
    const clearBtn = screen.getByRole('button', { name: /clear input/i });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);
    // We only verify onChange was called (actual clearing handled in parent)
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows and toggles password visibility', () => {
    render(
      <InputField
        label="Password"
        type="password"
        passwordToggle
        value="secret"
      />
    );
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    // Now input type should be text
    expect(input).toHaveAttribute('type', 'text');
    // Toggle back
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders required indicator and sets required attr', () => {
    render(
      <InputField
        label="Full Name"
        required
        value=""
        helperText="This is a required field"
      />
    );
    const label = screen.getByText(/Full Name/);
    expect(label.textContent).toMatch('*');
    const input = screen.getByLabelText(/Full Name/);
    expect(input).toBeRequired();
  });

  it('combines error and helper aria-describedby correctly', () => {
    render(
      <InputField
        label="Combined"
        helperText="Help"
        errorMessage="Error"
        invalid
        value=""
      />
    );
    const input = screen.getByLabelText('Combined');
    // aria-describedby includes error first (priority)
    const errorId = screen.getByText('Error').id;
    const helperId = screen.getByText('Help').id;
    expect(input.getAttribute('aria-describedby')).toContain(errorId);
    expect(input.getAttribute('aria-describedby')).toContain(helperId);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
