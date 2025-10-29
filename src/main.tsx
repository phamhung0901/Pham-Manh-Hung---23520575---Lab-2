/** @jsx createElement */
/**
 * Main entry point for the application
 * This file imports and mounts the app to the DOM
 */

import { createElement, mount, useState } from './jsx-runtime';
import { Counter } from './counter';
import { TodoApp } from './todo-app';
import { Dashboard } from './dashboard';

// Get the app container
const appContainer = document.getElementById('app') as HTMLElement;

if (!appContainer) {
  throw new Error('App container not found');
}

/**
 * Create a simple navigation app to switch between demos
 */
const App = (): any => {
  const [getActiveTab, setActiveTab] = useState('dashboard');

  function renderContent(): any {
    switch (getActiveTab()) {
      case 'counter':
        return createElement(Counter, { initialCount: 0 });
      case 'todos':
        return createElement(TodoApp, {});
      case 'dashboard':
      default:
        return createElement(Dashboard, {});
    }
  }

  return createElement('div', { className: 'app-wrapper' },
    // Navigation
    createElement('nav', { className: 'app-nav', style: { backgroundColor: '#2c3e50', padding: '20px', color: 'white' } },
      createElement('div', { className: 'nav-content', style: { maxWidth: '1200px', margin: '0 auto' } },
        createElement('div', { className: 'nav-buttons', style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } },
          createElement('button', {
            style: {
              padding: '10px 20px',
              backgroundColor: getActiveTab() === 'dashboard' ? '#3498db' : '#34495e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            },
            onClick: () => setActiveTab('dashboard')
          }, 'Dashboard'),
          createElement('button', {
            style: {
              padding: '10px 20px',
              backgroundColor: getActiveTab() === 'counter' ? '#3498db' : '#34495e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            },
            onClick: () => setActiveTab('counter')
          }, 'Counter'),
          createElement('button', {
            style: {
              padding: '10px 20px',
              backgroundColor: getActiveTab() === 'todos' ? '#3498db' : '#34495e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            },
            onClick: () => setActiveTab('todos')
          }, 'Todo App')
        )
      )
    ),

    // Content
    createElement('div', { className: 'app-content', style: { padding: '20px' } },
      renderContent()
    )
  );
};

// Mount the app
mount(createElement(App, {}), appContainer);

// Log success message
console.log('✅ JSX Without React - Lab 2 App loaded successfully!');
console.log('📋 Available demos: Dashboard, Counter, Todo App');
