/** @jsx createElement */
import { createElement, useState, ComponentProps } from './jsx-runtime';

// ============================================================
// PART 2.1: Counter Component
// ============================================================

/**
 * ButtonProps - Props for the Button component
 */
export interface ButtonProps extends ComponentProps {
  onClick?: (event: MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  children: string | number;
}

/**
 * Button - Reusable button component
 */
const Button = (props: ButtonProps): any => {
  const { onClick, className = '', disabled = false, children } = props;

  return createElement('button', {
    onClick: onClick,
    className: `btn ${className}`,
    disabled: disabled,
  }, children);
};

/**
 * CounterProps - Props for Counter component
 */
export interface CounterProps extends ComponentProps {
  initialCount?: number;
}

/**
 * Counter - Functional component with state management
 * Demonstrates useState hook usage
 */
const Counter = (props: CounterProps): any => {
  const initialCount = props.initialCount || 0;

  // STEP 1: Use useState for count value
  const [getCount, setCount] = useState(initialCount);

  // STEP 2: Create increment, decrement, reset functions
  const increment = () => setCount(getCount() + 1);
  const decrement = () => setCount(getCount() - 1);
  const reset = () => setCount(initialCount);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === '+') {
      e.preventDefault();
      increment();
    } else if (e.key === 'ArrowDown' || e.key === '-') {
      e.preventDefault();
      decrement();
    } else if (e.key === '0' || e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      reset();
    }
  };

  // STEP 3: Return JSX structure
  return createElement('div', { 
    className: 'counter',
    onKeyDown: handleKeyDown,
    tabIndex: 0,
    style: { outline: 'none' }
  },
    createElement('h2', null, `Count: ${getCount()}`),
    createElement('p', { style: { color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '20px' } },
      'Shortcuts: ↑/↓ or +/- or 0/r to reset'
    ),
    createElement('div', { className: 'counter-buttons' },
      createElement(Button, {
        onClick: () => increment(),
        className: 'btn-primary'
      }, '➕ Increment'),
      createElement(Button, {
        onClick: () => decrement(),
        className: 'btn-secondary'
      }, '➖ Decrement'),
      createElement(Button, {
        onClick: () => reset(),
        className: 'btn-danger'
      }, '🔄 Reset')
    )
  );
};

export { Button, Counter };
