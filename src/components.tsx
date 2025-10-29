/** @jsx createElement */
import { createElement, ComponentProps } from './jsx-runtime';

// ============================================================
// PART 3.2: Component Library
// ============================================================

/**
 * Card Component - Reusable card container
 */
export interface CardProps extends ComponentProps {
  title?: string;
  className?: string;
  onClick?: (event: MouseEvent) => void;
}

export const Card = (props: CardProps): any => {
  const { title, className = '', onClick, children } = props;

  return createElement('div', {
    className: `card ${className}`,
    onClick: onClick
  },
    title && createElement('div', { className: 'card-header' },
      createElement('h3', { className: 'card-title' }, title)
    ),
    createElement('div', { className: 'card-body' }, 
      ...(Array.isArray(children) ? children : (children !== undefined ? [children] : []))
    )
  );
};

/**
 * Modal Component - Overlay modal dialog
 */
export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  className?: string;
}

export const Modal = (props: ModalProps): any => {
  const { isOpen, onClose, title, className = '', children } = props;

  if (!isOpen) {
    return null;
  }

  return createElement('div', { className: 'modal-overlay' },
    createElement('div', {
      className: `modal ${className}`,
      onClick: (e: Event) => e.stopPropagation()
    },
      createElement('div', { className: 'modal-header' },
        title && createElement('h2', { className: 'modal-title' }, title),
        createElement('button', {
          className: 'modal-close',
          onClick: onClose,
          children: '×'
        })
      ),
      createElement('div', { className: 'modal-body' }, 
        ...(Array.isArray(children) ? children : (children !== undefined ? [children] : []))
      ),
      createElement('div', { className: 'modal-footer' },
        createElement('button', {
          className: 'btn btn-primary',
          onClick: onClose
        }, 'Close')
      )
    )
  );
};

/**
 * Form Component - Form wrapper with submission handling
 */
export interface FormProps extends ComponentProps {
  onSubmit?: (event: Event) => void;
  className?: string;
}

export const Form = (props: FormProps): any => {
  const { onSubmit, className = '', children } = props;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return createElement('form', {
    onSubmit: handleSubmit,
    className: `form ${className}`
  }, ...(Array.isArray(children) ? children : (children !== undefined ? [children] : [])));
};

/**
 * Input Component - Enhanced input element
 */
export interface InputProps extends ComponentProps {
  type?: string;
  value?: string | number;
  onChange?: (event: Event) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Input = (props: InputProps): any => {
  const {
    type = 'text',
    value = '',
    onChange,
    placeholder = '',
    className = '',
    name,
    disabled = false,
    required = false,
    ...rest
  } = props;

  return createElement('input', {
    type,
    value,
    onChange,
    placeholder,
    className: `input ${className}`,
    name,
    disabled,
    required,
    ...rest
  });
};

/**
 * Button Component - Enhanced button element
 */
export interface StyledButtonProps extends ComponentProps {
  onClick?: (event: MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  children: string | number;
}

export const StyledButton = (props: StyledButtonProps): any => {
  const {
    onClick,
    className = '',
    disabled = false,
    variant = 'primary',
    children
  } = props;

  return createElement('button', {
    onClick,
    className: `btn btn-${variant} ${className}`,
    disabled
  }, children);
};

/**
 * Select Component - Dropdown select element
 */
export interface SelectProps extends ComponentProps {
  value?: string;
  onChange?: (event: Event) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
  name?: string;
}

export const Select = (props: SelectProps): any => {
  const {
    value = '',
    onChange,
    options,
    placeholder = 'Select an option',
    className = '',
    name
  } = props;

  // Render and immediately set the value on the select element
  const selectEl = createElement('select', {
    value: value || '',
    onChange,
    className: `select ${className}`,
    name
  },
    placeholder && createElement('option', { value: '' }, placeholder),
    ...(options ? options.map(opt =>
      createElement('option', { value: opt.value }, opt.label)
    ) : [])
  );

  // If we have a render context, we can set the value after render
  // For now, we'll ensure the value is properly reflected
  return selectEl;
};

/**
 * TextArea Component - Multi-line text input
 */
export interface TextAreaProps extends ComponentProps {
  value?: string;
  onChange?: (event: Event) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  cols?: number;
  disabled?: boolean;
}

export const TextArea = (props: TextAreaProps): any => {
  const {
    value = '',
    onChange,
    placeholder = '',
    className = '',
    rows = 4,
    cols = 50,
    disabled = false
  } = props;

  return createElement('textarea', {
    value,
    onChange,
    placeholder,
    className: `textarea ${className}`,
    rows,
    cols,
    disabled
  });
};

/**
 * Badge Component - Small label/badge element
 */
export interface BadgeProps extends ComponentProps {
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  children: string | number;
}

export const Badge = (props: BadgeProps): any => {
  const { variant = 'default', className = '', children } = props;

  return createElement('span', {
    className: `badge badge-${variant} ${className}`
  }, children);
};

export default {
  Card,
  Modal,
  Form,
  Input,
  StyledButton,
  Select,
  TextArea,
  Badge
};
