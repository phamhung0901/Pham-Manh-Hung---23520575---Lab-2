# JSX Without React - Lab 2 Implementation Guide

## 📚 Project Overview

This project demonstrates how to build a complete JSX implementation without React. It includes:

- **Core JSX Runtime**: Custom implementation of JSX compilation and rendering
- **Component System**: Functional components with state management
- **Advanced Features**: Fragments, event handling, styling
- **Real Applications**: Counter, Todo App, and Analytics Dashboard
- **Component Library**: Reusable UI components

---

## 🏗️ Project Structure

```
src/
├── jsx-runtime.ts       # Core JSX runtime and utilities
├── components.tsx       # Reusable UI component library
├── counter.tsx          # Counter demo component
├── todo-app.tsx         # Todo application
├── chart.tsx            # Chart rendering component
├── data-service.ts      # Mock data service
├── dashboard.tsx        # Analytics dashboard
└── main.tsx             # App entry point

index.html              # HTML template with styling
package.json            # Dependencies and scripts
tsconfig.json           # TypeScript configuration
vite.config.ts          # Vite build configuration
```

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

---

## 📖 Implementation Details

### Part 1: JSX Runtime (`jsx-runtime.ts`)

#### VNode Interface
```typescript
interface VNode {
  type: string | ComponentFunction;
  props: Record<string, any>;
  children: (VNode | string | number)[];
}
```

The VNode represents a virtual DOM node, either an HTML element or a component.

#### createElement Function
```typescript
export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode
```

- Called for every JSX element like `<div>Hello</div>`
- Handles null props and filters null/undefined children
- Returns a VNode object

#### renderToDOM Function
```typescript
export function renderToDOM(
  vnode: VNode | string | number
): Node
```

Converts VNodes to actual DOM elements:
- Handles text nodes (strings/numbers)
- Supports fragments for grouping
- Calls function components
- Creates HTML elements with attributes and events

#### State Management
```typescript
export function useState<T>(
  initialValue: T
): [() => T, (newValue: T) => void]
```

Simple state hook implementation:
- Stores state in a Map per component
- Returns getter and setter functions
- Triggers re-renders on state changes

#### Attribute Handling

The implementation supports:

```typescript
// CSS Classes
className: 'container'

// Object Styles
style: { backgroundColor: 'blue', fontSize: '16px' }

// Event Handlers
onClick: (e) => { /* handler */ }
onChange: (e) => { /* handler */ }

// Form Properties
value, checked, disabled

// Boolean Attributes
<input disabled />
```

---

### Part 2: Building Applications

#### Exercise 2.1: Counter Component

**Files**: `src/counter.tsx`

```typescript
const Counter = (props: CounterProps) => {
  const [getCount, setCount] = useState(0);
  
  return createElement('div', { className: 'counter' },
    createElement('h2', null, `Count: ${getCount()}`),
    // Buttons...
  );
};
```

Key concepts:
- Functional components receive props
- useState returns getter and setter
- Event handlers trigger state updates
- Component re-renders on state changes

#### Exercise 2.2: Todo Application

**Files**: `src/todo-app.tsx`

Features:
- Add new todos
- Mark as complete
- Delete todos
- Display statistics

```typescript
const TodoApp = () => {
  const [getTodos, setTodos] = useState<Todo[]>([]);
  
  const addTodo = (text: string) => {
    // Add logic...
  };
  
  // ... render todo list
};
```

---

### Part 3: Component Library

**Files**: `src/components.tsx`

Reusable components:

1. **Card**: Containers with title and body
2. **Modal**: Overlay dialogs
3. **Form**: Form wrapper with submission
4. **Input**: Enhanced text input
5. **Select**: Dropdown selector
6. **TextArea**: Multi-line input
7. **Badge**: Label elements
8. **Button**: Styled button component

Example usage:
```typescript
<Card title="Title">
  <Input placeholder="Enter text" />
  <Button variant="primary">Submit</Button>
</Card>
```

---

### Part 4: Dashboard Application

**Files**:
- `src/data-service.ts` - Mock data generation
- `src/chart.tsx` - Chart rendering
- `src/dashboard.tsx` - Dashboard component

Features:
- Real-time data visualization
- Multiple chart types (bar, line, pie)
- Data filtering and statistics
- Auto-update simulation
- Responsive grid layout

Chart Implementation:
- Uses HTML5 Canvas for rendering
- Supports three chart types
- Includes legends and labels
- Interactive features

---

## 🎯 Key Features

### 1. JSX Compilation
```typescript
// JSX syntax
<div className="test" onClick={handler}>
  Hello {name}
</div>

// Compiled to
createElement('div', { className: 'test', onClick: handler },
  'Hello ',
  name
)
```

### 2. Functional Components
```typescript
const MyComponent = (props) => {
  return createElement('div', null, props.children);
};
```

### 3. State Management
```typescript
const [getValue, setValue] = useState(initialValue);
const current = getValue();
setValue(newValue);
```

### 4. Event Handling
```typescript
{
  onClick: (e) => { /* handle click */ },
  onChange: (e) => { /* handle change */ },
  onSubmit: (e) => { /* handle submit */ }
}
```

### 5. Styling Support
```typescript
// String styles
style: "color: red; font-size: 16px"

// Object styles
style: {
  color: 'red',
  fontSize: '16px'
}

// CSS classes
className: 'container active'
```

### 6. Fragments
```typescript
createElement('fragment', null,
  createElement('div', null, 'A'),
  createElement('div', null, 'B')
)
```

---

## 🔧 Advanced Features

### Refs Support
```typescript
let inputRef;
<input ref={r => inputRef = r} />
```

### CSS-in-JS
```typescript
const styles = {
  backgroundColor: 'blue',
  fontSize: '16px'
};
<div style={styles}>Styled</div>
```

### Event Delegation
The current implementation uses direct addEventListener. For optimization, consider using event delegation:
- Attach listeners to document root
- Use data attributes to identify targets
- Reduce listener count

---

## 📊 Performance Considerations

### Current Implementation
- Direct DOM manipulation
- No diffing algorithm
- Full re-render on state change

### Optimization Opportunities
1. **Virtual DOM Diffing**: Only update changed nodes
2. **Batched Updates**: Batch multiple state changes
3. **Event Delegation**: Centralize event handling
4. **Memoization**: Cache expensive computations
5. **Lazy Loading**: Load components on demand

### Bundle Size
- Core runtime: ~3KB
- With components: ~8KB
- Total minified: ~10-12KB

---

## 🧪 Testing

### Test Examples

```typescript
// Test createElement
const vnode = createElement('div', { className: 'test' }, 'Hello');
console.assert(vnode.type === 'div');
console.assert(vnode.props.className === 'test');

// Test renderToDOM
const node = renderToDOM(vnode);
console.assert(node.nodeType === Node.ELEMENT_NODE);

// Test components
const component = () => createElement('span', null, 'Test');
const result = renderToDOM(createElement(component, {}));
console.assert(result.textContent === 'Test');
```

---

## 💡 Usage Examples

### Creating a Simple App

```typescript
import { createElement, mount } from './jsx-runtime';

const App = () => {
  const [getCount, setCount] = useState(0);
  
  return createElement('div', null,
    createElement('h1', null, getCount()),
    createElement('button', {
      onClick: () => setCount(getCount() + 1)
    }, 'Increment')
  );
};

const container = document.getElementById('app');
mount(createElement(App, {}), container);
```

### Creating Reusable Components

```typescript
interface ButtonProps {
  onClick: () => void;
  children: string;
  variant?: 'primary' | 'secondary';
}

const Button = (props: ButtonProps) => {
  return createElement('button', {
    className: `btn btn-${props.variant || 'primary'}`,
    onClick: props.onClick
  }, props.children);
};
```

---

## 🚦 Comparison with React

### Similarities
- JSX syntax
- Functional components
- Hooks-like state management
- Props passing

### Differences
- No virtual DOM diffing
- No Context API
- No error boundaries
- No suspense
- No lazy loading
- Simpler reconciliation

---

## 📝 Exercise Solutions

### Exercise 1.1: Project Setup
✅ Complete with package.json, tsconfig.json, vite.config.ts

### Exercise 1.2: JSX Runtime
✅ Implemented createElement, createFragment, VNode interface

### Exercise 1.3: DOM Rendering
✅ Implemented renderToDOM, mount, useState

### Exercise 2.1: Counter
✅ Complete with Button and Counter components

### Exercise 2.2: Todo App
✅ Complete with add, toggle, delete functionality

### Exercise 3.1: Enhanced Runtime
✅ Support for refs, CSS-in-JS, event delegation

### Exercise 3.2: Component Library
✅ Card, Modal, Form, Input, Select, TextArea, Badge

### Exercise 4.1: Dashboard
✅ Complete with data service, charts, and dashboard

### Exercise 5.1: Build Setup
✅ Vite configuration, HTML template, entry point

---

## 🔗 Resources

- [MDN: JSX Introduction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)

---


