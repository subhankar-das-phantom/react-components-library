// src/components/InputField/InputField.tsx
import React, { useId, useMemo, useState } from 'react';

export type InputVariant = 'filled' | 'outlined' | 'ghost';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  type?: React.HTMLInputTypeAttribute;
  name?: string;
  id?: string;
  autoFocus?: boolean;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  // Optional features
  clearable?: boolean;
  passwordToggle?: boolean;
  // Icons or custom slots (optional)
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  // Accessibility
  ariaLabel?: string;
  darkMode?: boolean;
}

/**
 * InputField
 * - Variants: filled | outlined | ghost
 * - Sizes: sm | md | lg
 * - States: disabled | invalid | loading
 * - Optional: clear button, password toggle
 * - Basic a11y: label association, aria-invalid, aria-describedby, aria-busy
 */
export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  loading = false,
  variant = 'outlined',
  size = 'md',
  type = 'text',
  name,
  id,
  autoFocus,
  required,
  className = '',
  inputClassName = '',
  labelClassName = '',
  clearable = false,
  passwordToggle = false,
  startAdornment,
  endAdornment,
  ariaLabel,
  darkMode,
}) => {
  const generatedId = useId();
  const inputId = id ?? `input-${generatedId}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = errorMessage ? `${inputId}-error` : undefined;

  const [internalType, setInternalType] = useState(type);

  // Allow password toggle only when base type is "password" or "text"
  const canTogglePassword =
    passwordToggle && (type === 'password' || type === 'text');

  // Compute describedBy to include error first (priority) then helper
  const ariaDescribedBy = useMemo(() => {
    const ids: string[] = [];
    if (errorId) ids.push(errorId);
    if (helperId) ids.push(helperId);
    return ids.join(' ') || undefined;
  }, [errorId, helperId]);

  // Size styles
  const sizeStyles: Record<InputSize, { root: string; input: string; label: string }> = {
    sm: {
      root: 'gap-1',
      input: 'text-sm h-9 px-3',
      label: 'text-sm',
    },
    md: {
      root: 'gap-1.5',
      input: 'text-base h-10 px-3.5',
      label: 'text-sm',
    },
    lg: {
      root: 'gap-2',
      input: 'text-base h-11 px-4',
      label: 'text-base',
    },
  };

  // Variant styles
const variantStyles: Record<InputVariant, string> = {
  outlined: darkMode
    ? 'border border-neutral-700 focus:border-blue-500 dark:focus:border-blue-500'
    : 'border border-neutral-300 focus:border-blue-500',
  filled: darkMode
    ? 'bg-neutral-800 border border-transparent focus:border-blue-500'
    : 'bg-neutral-100 border border-transparent focus:border-blue-500',
  ghost: 'bg-transparent border border-transparent focus:border-blue-500',
};
  // Invalid/disabled/loading overlays
  const stateStyles = [
    invalid ? 'ring-1 ring-red-500 focus:ring-2 focus:ring-red-500' : 'focus:ring-2 focus:ring-blue-500',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text',
    loading ? 'pr-10' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Base input styles
const baseInput = [
  'w-full rounded-md outline-none transition-colors placeholder:text-neutral-400',
  darkMode ? 'bg-neutral-900 text-neutral-100 placeholder:text-neutral-500' : 'bg-white text-black placeholder:text-gray-500'
].join(' ');

  // Container styles
  const container =
    'w-full flex flex-col ' + sizeStyles[size].root + (className ? ` ${className}` : '');

  // Label styles
  const baseLabel = darkMode ? 'text-neutral-300' : 'text-gray-700';
  const labelCls =
    `${baseLabel} ${sizeStyles[size].label}` +
    (labelClassName ? ` ${labelClassName}` : '');

  // Input wrapper for adornments and buttons
  const inputWrapper =
    'relative flex items-center w-full';

  // Compute input class
  const inputCls = [
    baseInput,
    sizeStyles[size].input,
    variantStyles[variant],
    stateStyles,
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ');

  // Clear button visible when clearable, not disabled/loading, and value present
  const showClear =
    clearable && !disabled && !loading && typeof value === 'string' && value.length > 0;

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onChange) return;
    // create a synthetic event to clear
    const target = document.getElementById(inputId) as HTMLInputElement | null;
    if (target) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(target, '');
        const ev = new Event('input', { bubbles: true });
        target.dispatchEvent(ev);
      } else {
        // Fallback: call onChange with empty value
        const syntheticEvent = {
          ...e,
          target: { value: '' } as any,
          currentTarget: { value: '' } as any,
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    } else {
      const syntheticEvent = {
        ...e,
        target: { value: '' } as any,
        currentTarget: { value: '' } as any,
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const togglePassword = () => {
    setInternalType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  return (
    <div className={container}>
      {label && (
        <label htmlFor={inputId} className={labelCls}>
          {label}
          {required ? <span className="text-red-500 pl-0.5" aria-hidden>*</span> : null}
        </label>
      )}

      <div className={inputWrapper}>
        {startAdornment ? (
          <span className="absolute left-2.5 text-neutral-500 dark:text-neutral-400 pointer-events-none">
            {startAdornment}
          </span>
        ) : null}

        <input
          id={inputId}
          name={name}
          type={canTogglePassword ? internalType : type}
          className={[
            inputCls,
            startAdornment ? 'pl-9' : '',
            (showClear || loading || endAdornment || (canTogglePassword && type === 'password')) ? 'pr-10' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={ariaDescribedBy}
          aria-busy={loading || undefined}
          aria-label={ariaLabel}
          autoFocus={autoFocus}
          required={required}
        />

        {/* Loading spinner */}
        {loading && (
          <span
            className="absolute right-2.5 inline-flex items-center"
            aria-hidden
          >
            <svg
              className="animate-spin h-5 w-5 text-neutral-400 dark:text-neutral-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </span>
        )}

        {/* Password toggle button */}
        {canTogglePassword && !loading && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-2.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={internalType === 'password' ? 'Show password' : 'Hide password'}
            tabIndex={-1}
          >
            {internalType === 'password' ? (
              // Eye icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 5 12 5c4.64 0 8.577 2.51 9.964 6.678.07.21.07.434 0 .644C20.577 16.49 16.64 19 12 19c-4.64 0-8.577-2.51-9.964-6.678z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              // Eye-slash icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 3l18 18M10.584 10.59A3 3 0 0012 15a3 3 0 002.121-.879M9.88 4.19a9.973 9.973 0 012.12-.19c4.64 0 8.577 2.51 9.964 6.678.07.21.07.434 0 .644a12.042 12.042 0 01-3.098 4.72M6.228 6.227A12.039 12.039 0 002.036 11.68c-.07.21-.07.434 0 .644C3.423 16.49 7.36 19 12 19c1.24 0 2.433-.182 3.555-.52" />
              </svg>
            )}
          </button>
        )}

        {/* End adornment (custom) if provided and no loading/password toggle occupying the slot */}
        {endAdornment && !loading && !canTogglePassword && (
          <span className="absolute right-2.5 text-neutral-500 dark:text-neutral-400">
            {endAdornment}
          </span>
        )}

        {/* Clear button */}
        {showClear && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Clear input"
            tabIndex={-1}
          >
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.293-6.707a1 1 0 111.414 1.414L9.414 14l.707.707a1 1 0 01-1.414 1.414L8 15.414l-.707.707a1 1 0 01-1.414-1.414L6.586 14l-.707-.707a1 1 0 011.414-1.414L8 12.586l.707-.707z"
                    clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Helper or error messages */}
      <div className="min-h-[1.25rem]">
        {errorMessage ? (
          <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p id={helperId} className={`mt-1 text-sm ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
            {helperText}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default InputField;
