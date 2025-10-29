/** @jsx createElement */
import { createElement, useState, ComponentProps } from './jsx-runtime';

// ============================================================
// PART 2.2: Todo List Application
// ============================================================

/**
 * Todo interface - Represents a single todo item
 */
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

/**
 * TodoItemProps - Props for todo item component
 */
export interface TodoItemProps extends ComponentProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

/**
 * TodoItem - Individual todo item component
 */
const TodoItem = (props: TodoItemProps): any => {
  const { todo, onToggle, onDelete } = props;

  return createElement('li', { className: 'todo-item' },
    createElement('input', {
      type: 'checkbox',
      checked: todo.completed,
      onChange: () => onToggle(todo.id),
      className: 'todo-checkbox'
    }),
    createElement('span', {
      className: `todo-text ${todo.completed ? 'completed' : ''}`,
      style: todo.completed
        ? { textDecoration: 'line-through', color: '#999' }
        : {}
    }, todo.text),
    createElement('button', {
      onClick: () => onDelete(todo.id),
      className: 'btn-delete'
    }, 'Delete')
  );
};

/**
 * AddTodoFormProps - Props for add todo form
 */
export interface AddTodoFormProps extends ComponentProps {
  onAdd: (text: string) => void;
}

/**
 * AddTodoForm - Form component for adding new todos
 */
const AddTodoForm = (props: AddTodoFormProps): any => {
  const { onAdd } = props;
  const [getInput, setInput] = useState('');

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const inputValue = getInput();
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInput('');
    }
  };

  return createElement('form', {
    onSubmit: handleSubmit,
    className: 'add-todo-form'
  },
    createElement('input', {
      type: 'text',
      value: getInput(),
      onChange: (e: Event) => {
        const input = e.target as HTMLInputElement;
        setInput(input.value);
      },
      placeholder: 'Add a new todo...',
      className: 'todo-input'
    }),
    createElement('button', {
      type: 'submit',
      className: 'btn btn-primary'
    }, 'Add Todo')
  );
};

/**
 * TodoApp - Main todo application component
 */
const TodoApp = (): any => {
  // STEP 1: State for todos array
  const [getTodos, setTodos] = useState<Todo[]>([]);
  const [getFilter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [getSearch, setSearch] = useState('');
  let nextId = 1;

  // STEP 2: Functions to add, toggle, delete todos
  const addTodo = (text: string) => {
    const currentTodos = getTodos();
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date()
    };
    setTodos([...currentTodos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    const currentTodos = getTodos();
    const updated = currentTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
  };

  const deleteTodo = (id: number) => {
    const currentTodos = getTodos();
    const updated = currentTodos.filter(todo => todo.id !== id);
    setTodos(updated);
  };

  const clearCompleted = () => {
    const currentTodos = getTodos();
    const updated = currentTodos.filter(todo => !todo.completed);
    setTodos(updated);
  };

  // Filter todos
  const todos = getTodos();
  let filteredTodos = todos;

  if (getFilter() === 'active') {
    filteredTodos = todos.filter(t => !t.completed);
  } else if (getFilter() === 'completed') {
    filteredTodos = todos.filter(t => t.completed);
  }

  if (getSearch()) {
    filteredTodos = filteredTodos.filter(t => 
      t.text.toLowerCase().includes(getSearch().toLowerCase())
    );
  }

  // Calculate statistics
  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = totalCount - completedCount;

  // STEP 3: Return JSX structure
  return createElement('div', { className: 'todo-app' },
    createElement('h1', null, '📝 My Todo App'),
    createElement(AddTodoForm, { onAdd: addTodo }),
    
    // Search bar
    createElement('div', { style: { marginBottom: '20px' } },
      createElement('input', {
        type: 'text',
        value: getSearch(),
        onChange: (e: Event) => {
          const input = e.target as HTMLInputElement;
          setSearch(input.value);
        },
        placeholder: '🔍 Search todos...',
        className: 'todo-input',
        style: { marginBottom: '10px' }
      })
    ),

    // Stats and filters
    createElement('div', { className: 'todo-stats', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
      createElement('div', null, 
        `📊 Total: ${totalCount} | ✅ Done: ${completedCount} | ⏳ Active: ${activeCount}`
      ),
      ...(completedCount > 0
        ? [createElement('button', {
            onClick: clearCompleted,
            className: 'btn btn-secondary',
            style: { padding: '5px 10px', fontSize: '0.9rem' }
          }, 'Clear Done')]
        : [])
    ),

    // Filter buttons
    createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '20px' } },
      createElement('button', {
        onClick: () => setFilter('all'),
        className: `btn ${getFilter() === 'all' ? 'btn-primary' : 'btn-secondary'}`,
        style: { padding: '8px 16px' }
      }, 'All'),
      createElement('button', {
        onClick: () => setFilter('active'),
        className: `btn ${getFilter() === 'active' ? 'btn-primary' : 'btn-secondary'}`,
        style: { padding: '8px 16px' }
      }, 'Active'),
      createElement('button', {
        onClick: () => setFilter('completed'),
        className: `btn ${getFilter() === 'completed' ? 'btn-primary' : 'btn-secondary'}`,
        style: { padding: '8px 16px' }
      }, 'Done')
    ),

    // Todo list
    createElement('ul', { className: 'todo-list' },
      ...(filteredTodos.length > 0
        ? filteredTodos.map(todo =>
            createElement(TodoItem, {
              key: todo.id,
              todo,
              onToggle: toggleTodo,
              onDelete: deleteTodo
            })
          )
        : [createElement('li', { style: { textAlign: 'center', padding: '20px', color: '#999' } }, 
            getSearch() 
              ? '❌ No todos match your search' 
              : getFilter() === 'active'
              ? '🎉 All todos completed!'
              : '📭 No todos yet. Add one to get started!'
          )])
    )
  );
};

export { TodoItem, AddTodoForm, TodoApp };
