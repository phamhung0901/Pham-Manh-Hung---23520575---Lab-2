/**
 * Example Tests for JSX Runtime
 * This file demonstrates how to test the JSX implementation
 */

import { createElement, createFragment, renderToDOM, VNode } from './jsx-runtime';

// ============================================================
// Test Suite 1: createElement Function
// ============================================================

console.group('Test Suite 1: createElement Function');

// Test 1.1: Create simple element
const test1_1 = (): void => {
  const vnode = createElement('div', { className: 'test' }, 'Hello');
  console.assert(vnode.type === 'div', 'Element type should be "div"');
  console.assert(vnode.props.className === 'test', 'className prop should be "test"');
  console.assert(vnode.children.length === 1, 'Should have 1 child');
  console.assert(vnode.children[0] === 'Hello', 'Child should be "Hello"');
  console.log('✓ Test 1.1: Create simple element - PASSED');
};

// Test 1.2: Handle null props
const test1_2 = (): void => {
  const vnode = createElement('span', null, 'Text');
  console.assert(vnode.props !== null, 'Props should not be null');
  console.assert(Object.keys(vnode.props).length === 0, 'Props should be empty object');
  console.log('✓ Test 1.2: Handle null props - PASSED');
};

// Test 1.3: Filter children
const test1_3 = (): void => {
  const vnode = createElement('div', null, 'A', undefined, 'B', 'C');
  console.assert(vnode.children.length === 3, 'Should filter out null/undefined');
  console.assert(vnode.children[0] === 'A', 'First child should be "A"');
  console.assert(vnode.children[1] === 'B', 'Second child should be "B"');
  console.assert(vnode.children[2] === 'C', 'Third child should be "C"');
  console.log('✓ Test 1.3: Filter children - PASSED');
};

// Test 1.4: Create fragment
const test1_4 = (): void => {
  const vnode = createFragment(null, 'A', 'B');
  console.assert(vnode.type === 'fragment', 'Fragment type should be "fragment"');
  console.assert(vnode.children.length === 2, 'Fragment should have 2 children');
  console.log('✓ Test 1.4: Create fragment - PASSED');
};

test1_1();
test1_2();
test1_3();
test1_4();

console.groupEnd();

// ============================================================
// Test Suite 2: renderToDOM Function
// ============================================================

console.group('Test Suite 2: renderToDOM Function');

// Test 2.1: Render text node
const test2_1 = (): void => {
  const node = renderToDOM('Hello');
  console.assert(node.nodeType === Node.TEXT_NODE, 'Should create text node');
  console.assert(node.textContent === 'Hello', 'Text content should be "Hello"');
  console.log('✓ Test 2.1: Render text node - PASSED');
};

// Test 2.2: Render element
const test2_2 = (): void => {
  const vnode = createElement('div', { className: 'test' }, 'Content');
  const node = renderToDOM(vnode) as HTMLElement;
  console.assert(node.nodeType === Node.ELEMENT_NODE, 'Should create element node');
  console.assert(node.tagName === 'DIV', 'Tag name should be DIV');
  console.assert(node.className === 'test', 'className should be "test"');
  console.assert(node.textContent === 'Content', 'Text content should be "Content"');
  console.log('✓ Test 2.2: Render element - PASSED');
};

// Test 2.3: Render with attributes
const test2_3 = (): void => {
  const vnode = createElement('input', {
    type: 'text',
    placeholder: 'Enter text',
    disabled: false
  });
  const node = renderToDOM(vnode) as HTMLInputElement;
  console.assert(node.type === 'text', 'Input type should be "text"');
  console.assert(node.placeholder === 'Enter text', 'Placeholder should be set');
  console.assert(node.disabled === false, 'Disabled should be false');
  console.log('✓ Test 2.3: Render with attributes - PASSED');
};

// Test 2.4: Render nested elements
const test2_4 = (): void => {
  const vnode = createElement('div', null,
    createElement('span', null, 'A'),
    createElement('span', null, 'B')
  );
  const node = renderToDOM(vnode) as HTMLElement;
  console.assert(node.children.length === 2, 'Should have 2 children');
  console.assert(node.children[0].textContent === 'A', 'First child should have text "A"');
  console.assert(node.children[1].textContent === 'B', 'Second child should have text "B"');
  console.log('✓ Test 2.4: Render nested elements - PASSED');
};

// Test 2.5: Render fragment
const test2_5 = (): void => {
  const vnode = createFragment(null,
    'A',
    'B',
    'C'
  );
  const node = renderToDOM(vnode) as DocumentFragment;
  console.assert(node.nodeType === Node.DOCUMENT_FRAGMENT_NODE, 'Should create fragment');
  console.assert(node.childNodes.length === 3, 'Fragment should have 3 children');
  console.log('✓ Test 2.5: Render fragment - PASSED');
};

test2_1();
test2_2();
test2_3();
test2_4();
test2_5();

console.groupEnd();

// ============================================================
// Test Suite 3: Component Functions
// ============================================================

console.group('Test Suite 3: Component Functions');

// Test 3.1: Simple component
const test3_1 = (): void => {
  const SimpleComponent = (props: any) => {
    return createElement('div', { className: 'component' }, props.message);
  };

  const vnode = createElement(SimpleComponent, { message: 'Hello Component' });
  const node = renderToDOM(vnode) as HTMLElement;
  console.assert(node.className === 'component', 'Component should render with className');
  console.assert(node.textContent === 'Hello Component', 'Component should render message');
  console.log('✓ Test 3.1: Simple component - PASSED');
};

// Test 3.2: Component with children
const test3_2 = (): void => {
  const Container = (props: any) => {
    return createElement('div', { className: 'container' }, props.children);
  };

  const vnode = createElement(Container, null,
    'Child 1',
    'Child 2'
  );
  const node = renderToDOM(vnode) as HTMLElement;
  console.assert(node.className === 'container', 'Container should have className');
  console.assert(node.textContent.includes('Child 1'), 'Should include Child 1');
  console.assert(node.textContent.includes('Child 2'), 'Should include Child 2');
  console.log('✓ Test 3.2: Component with children - PASSED');
};

test3_1();
test3_2();

console.groupEnd();

// ============================================================
// Test Suite 4: Styling
// ============================================================

console.group('Test Suite 4: Styling');

// Test 4.1: Class name
const test4_1 = (): void => {
  const vnode = createElement('div', { className: 'container active' });
  const node = renderToDOM(vnode) as HTMLElement;
  console.assert(node.className === 'container active', 'Should set className');
  console.log('✓ Test 4.1: Class name - PASSED');
};

// Test 4.2: Object styles
const test4_2 = (): void => {
  const vnode = createElement('div', {
    style: {
      backgroundColor: 'red',
      fontSize: '16px'
    }
  });
  const node = renderToDOM(vnode) as HTMLElement;
  console.assert(node.style.backgroundColor === 'red', 'Should set backgroundColor');
  console.assert(node.style.fontSize === '16px', 'Should set fontSize');
  console.log('✓ Test 4.2: Object styles - PASSED');
};

test4_1();
test4_2();

console.groupEnd();

// ============================================================
// Test Results Summary
// ============================================================

console.log('\n' + '='.repeat(50));
console.log('✅ All tests completed!');
console.log('='.repeat(50) + '\n');

/**
 * Performance Benchmarks
 */

console.group('Performance Benchmarks');

// Benchmark 1: createElement creation
const benchmark1 = (): void => {
  const iterations = 100000;
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    createElement('div', { className: 'test' }, 'Hello');
  }

  const end = performance.now();
  const time = end - start;
  console.log(`createElement (${iterations}x): ${time.toFixed(2)}ms (${(time / iterations).toFixed(4)}ms each)`);
};

// Benchmark 2: renderToDOM
const benchmark2 = (): void => {
  const vnode = createElement('div', { className: 'test' }, 'Hello');
  const iterations = 10000;
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    renderToDOM(vnode);
  }

  const end = performance.now();
  const time = end - start;
  console.log(`renderToDOM (${iterations}x): ${time.toFixed(2)}ms (${(time / iterations).toFixed(4)}ms each)`);
};

benchmark1();
benchmark2();

console.groupEnd();

export { };
