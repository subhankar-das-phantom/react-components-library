// src/components/InputField/InputField.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { InputField } from './InputField';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component with validation states, multiple variants, sizes, and optional features like clear button and password toggle.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined', 'ghost'],
      description: 'Visual style variant of the input',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input field',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'HTML input type',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the input',
    },
    invalid: {
      control: { type: 'boolean' },
      description: 'Shows invalid state styling',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Shows loading spinner',
    },
    clearable: {
      control: { type: 'boolean' },
      description: 'Shows clear button when input has value',
    },
    passwordToggle: {
      control: { type: 'boolean' },
      description: 'Shows password visibility toggle (for password inputs)',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Marks field as required',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InputField>;

// Wrapper component for controlled input stories
const ControlledInputField = (args: any) => {
  const [value, setValue] = useState(args.value || '');
  
  return (
    <InputField
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Default: Story = {
  render: ControlledInputField,
  args: {
    label: 'Default Input',
    placeholder: 'Enter some text...',
  },
};

export const WithHelperText: Story = {
  render: ControlledInputField,
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    helperText: 'We\'ll never share your email with anyone else.',
    type: 'email',
  },
};

export const WithError: Story = {
  render: ControlledInputField,
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    value: 'invalid-username!',
    invalid: true,
    errorMessage: 'Username can only contain letters, numbers, and underscores.',
  },
};

export const Required: Story = {
  render: ControlledInputField,
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
    helperText: 'This field is required',
  },
};

// Variant Stories
export const Variants: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <ControlledInputField
        label="Outlined (Default)"
        placeholder="Outlined variant"
        variant="outlined"
      />
      <ControlledInputField
        label="Filled"
        placeholder="Filled variant"
        variant="filled"
      />
      <ControlledInputField
        label="Ghost"
        placeholder="Ghost variant"
        variant="ghost"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants: outlined (default), filled, and ghost.',
      },
    },
  },
};

// Size Stories
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <ControlledInputField
        label="Small"
        placeholder="Small size"
        size="sm"
      />
      <ControlledInputField
        label="Medium (Default)"
        placeholder="Medium size"
        size="md"
      />
      <ControlledInputField
        label="Large"
        placeholder="Large size"
        size="lg"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes: small, medium (default), and large.',
      },
    },
  },
};

// State Stories
export const States: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <ControlledInputField
        label="Normal State"
        placeholder="Normal input"
      />
      <ControlledInputField
        label="Disabled State"
        placeholder="Disabled input"
        disabled={true}
        value="Cannot edit this"
      />
      <ControlledInputField
        label="Invalid State"
        placeholder="Invalid input"
        invalid={true}
        errorMessage="This field has an error"
        value="Invalid value"
      />
      <ControlledInputField
        label="Loading State"
        placeholder="Loading..."
        loading={true}
        value="Processing..."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different input states: normal, disabled, invalid, and loading.',
      },
    },
  },
};

export const Disabled: Story = {
  render: ControlledInputField,
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    value: 'Cannot edit this value',
    disabled: true,
    helperText: 'This field is read-only',
  },
};

export const Loading: Story = {
  render: ControlledInputField,
  args: {
    label: 'Loading Input',
    placeholder: 'Processing...',
    loading: true,
    value: 'Validating...',
  },
};

export const Invalid: Story = {
  render: ControlledInputField,
  args: {
    label: 'Invalid Input',
    placeholder: 'Enter valid data',
    value: 'invalid@',
    invalid: true,
    errorMessage: 'Please enter a valid email address',
    type: 'email',
  },
};

// Feature Stories
export const WithClearButton: Story = {
  render: ControlledInputField,
  args: {
    label: 'Search',
    placeholder: 'Type to search...',
    value: 'Clear me!',
    clearable: true,
    helperText: 'Click the × button to clear the input',
  },
};

export const PasswordField: Story = {
  render: ControlledInputField,
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    passwordToggle: true,
    helperText: 'Click the eye icon to toggle visibility',
  },
};

export const PasswordWithClear: Story = {
  render: ControlledInputField,
  args: {
    label: 'Password with Clear',
    placeholder: 'Enter password',
    type: 'password',
    passwordToggle: true,
    clearable: true,
    value: 'secret123',
    helperText: 'Both clear and toggle visibility are available',
  },
};

// Advanced Examples
export const AllFeatures: Story = {
  render: () => {
    const [password, setPassword] = useState('mypassword123');
    const [isValid, setIsValid] = useState(true);
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPassword(value);
      setIsValid(value.length >= 8);
    };
    
    return (
      <div className="w-80">
        <InputField
          label="Password"
          placeholder="Enter a strong password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          passwordToggle={true}
          clearable={true}
          required={true}
          invalid={!isValid}
          errorMessage={!isValid ? 'Password must be at least 8 characters long' : undefined}
          helperText={isValid ? 'Password strength: Good' : undefined}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with all features: password toggle, clear button, validation, required field.',
      },
    },
  },
};

export const DifferentTypes: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <ControlledInputField
        label="Email"
        placeholder="Enter your email"
        type="email"
        helperText="We'll send updates to this email"
      />
      <ControlledInputField
        label="Phone Number"
        placeholder="(555) 123-4567"
        type="tel"
      />
      <ControlledInputField
        label="Website"
        placeholder="https://example.com"
        type="url"
      />
      <ControlledInputField
        label="Age"
        placeholder="Enter your age"
        type="number"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different input types: email, tel, url, and number.',
      },
    },
  },
};

// Dark mode example (if you want to test dark mode)
export const DarkMode: Story = {
  render: ControlledInputField,
  args: {
    label: 'Dark Mode Input',
    placeholder: 'This works in dark mode too',
    helperText: 'Switch your Storybook theme to dark to see the effect',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'The component automatically adapts to dark mode using Tailwind\'s dark: classes.',
      },
    },
  },
};

// Form Layout Example
export const FormLayout: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    
    const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };
    
    return (
      <div className="space-y-4 w-96">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={updateField('firstName')}
            required
          />
          <InputField
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={updateField('lastName')}
            required
          />
        </div>
        <InputField
          label="Email Address"
          placeholder="john.doe@example.com"
          type="email"
          value={formData.email}
          onChange={updateField('email')}
          required
          helperText="We'll use this for your account login"
        />
        <InputField
          label="Password"
          placeholder="Enter a strong password"
          type="password"
          value={formData.password}
          onChange={updateField('password')}
          passwordToggle
          required
          invalid={formData.password.length > 0 && formData.password.length < 8}
          errorMessage={formData.password.length > 0 && formData.password.length < 8 ? 'Password must be at least 8 characters' : undefined}
        />
        <InputField
          label="Confirm Password"
          placeholder="Confirm your password"
          type="password"
          value={formData.confirmPassword}
          onChange={updateField('confirmPassword')}
          required
          invalid={formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword}
          errorMessage={formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword ? 'Passwords do not match' : undefined}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of using InputField components in a form layout with validation.',
      },
    },
  },
};
