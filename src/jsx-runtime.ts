/**
 * JSX Runtime - Custom JSX implementation without React
 * This module provides the core JSX functionality
 */

// ============================================================
// PART 1: Core Interfaces and Types
// ============================================================

/**
 * VNode represents a Virtual DOM node
 * It can represent either HTML elements or components
 */
export interface VNode {
  type: string | ComponentFunction;
  props: Record<string, any>;
  children: (VNode | string | number)[];
}

/**
 * ComponentProps interface for typing component props
 */
export interface ComponentProps {
  children?: VNode | VNode[] | string | number;
  [key: string]: any;
}

/**
 * ComponentFunction type for functional components
 */
export type ComponentFunction = (props: any) => VNode;

// ============================================================
// PART 2: JSX Factory Functions
// ============================================================

/**
 * createElement - Core JSX factory function
 * Called for every JSX element
 * 
 * @example
 * // <div className="test">Hello</div> becomes:
 * createElement('div', { className: 'test' }, 'Hello')
 */
export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> | null,
  ...children: (VNode | string | number | undefined)[]
): VNode {
  // STEP 1: Handle props (use empty object if null)
  const finalProps = props || {};

  // STEP 2: Flatten and filter children (remove null/undefined)
  const finalChildren = children
    .flat()
    .filter((child) => child !== null && child !== undefined);

  // STEP 3: Return VNode object
  return {
    type,
    props: finalProps,
    children: finalChildren,
  };
}

/**
 * createFragment - Create a fragment (grouping without wrapper)
 * @example
 * // <><div>A</div><div>B</div></> becomes:
 * createFragment(null, createElement('div', null, 'A'), createElement('div', null, 'B'))
 */
export function createFragment(
  props: Record<string, any> | null,
  ...children: (VNode | string | number | undefined)[]
): VNode {
  return createElement('fragment', props || {}, ...children);
}

// ============================================================
// PART 3: State Management
// ============================================================

let currentComponent: any = null;
let componentStates: Map<any, any[]> = new Map();
let stateIndex = 0;
let rootVNode: VNode | null = null;
let rootContainer: HTMLElement | null = null;
let renderedNode: Node | null = null;

/**
 * useState - Simple state hook for components
 * @example
 * const [count, setCount] = useState(0);
 */
export function useState<T>(
  initialValue: T
): [() => T, (newValue: T) => void] {
  const component = currentComponent;

  if (!componentStates.has(component)) {
    componentStates.set(component, []);
  }

  const states = componentStates.get(component) || [];
  const index = stateIndex;

  if (states[index] === undefined) {
    states[index] = initialValue;
  }

  const getter = () => states[index];
  const setter = (newValue: T) => {
    // Only update if value actually changed
    if (states[index] === newValue) {
      return;
    }
    
    states[index] = newValue;
    // Trigger re-render
    if (rootVNode && rootContainer) {
      stateIndex = 0;
      currentComponent = null;
      const newDom = renderToDOM(rootVNode);
      
      // Replace only the rendered node, not entire container
      if (renderedNode && renderedNode.parentNode) {
        renderedNode.parentNode.replaceChild(newDom, renderedNode);
      } else {
        rootContainer.innerHTML = '';
        rootContainer.appendChild(newDom);
      }
      renderedNode = newDom;
    }
  };

  stateIndex++;

  return [getter, setter];
}

// ============================================================
// PART 4: DOM Rendering
// ============================================================

/**
 * renderToDOM - Convert VNode to actual DOM node
 * @param vnode - Virtual node to render
 * @returns DOM node
 */
export function renderToDOM(vnode: VNode | string | number | undefined): Node {
  // Handle undefined
  if (vnode === undefined) {
    return document.createTextNode('');
  }

  // STEP 1: Handle text nodes
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  // STEP 2: Handle fragments
  if (vnode.type === 'fragment') {
    const fragment = document.createDocumentFragment();
    vnode.children.forEach((child) => {
      fragment.appendChild(renderToDOM(child));
    });
    return fragment;
  }

  // STEP 3: Handle component functions
  if (typeof vnode.type === 'function') {
    currentComponent = vnode.type;
    stateIndex = 0;
    const result = vnode.type(vnode.props);
    currentComponent = null;
    return renderToDOM(result);
  }

  // STEP 4: Handle regular HTML elements
  const element = document.createElement(vnode.type as string);

  // Set attributes and event handlers
  Object.entries(vnode.props).forEach(([key, value]) => {
    if (key === 'key' || key === 'ref' || key === '_onMounted') {
      // Skip internal props and callbacks
      return;
    }

    if (key.startsWith('on')) {
      // Handle events
      const eventName = key.substring(2).toLowerCase();
      if (typeof value === 'function') {
        element.addEventListener(eventName, value);
      }
    } else if (key === 'className') {
      // Handle className
      if (value) {
        element.className = value;
      }
    } else if (key === 'style') {
      // Handle styles (string or object)
      if (typeof value === 'string') {
        element.setAttribute('style', value);
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([styleKey, styleValue]) => {
          const cssKey = styleKey
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase();
          (element.style as any)[styleKey] = styleValue;
        });
      }
    } else if (key === 'value' || key === 'checked' || key === 'disabled') {
      // Handle form attributes - set as property AND attribute
      (element as any)[key] = value;
      if (key === 'value' && (vnode.type === 'input' || vnode.type === 'select' || vnode.type === 'textarea')) {
        element.setAttribute(key, String(value));
      }
    } else if (value !== null && value !== undefined && value !== false) {
      // Set other attributes
      if (typeof value === 'boolean') {
        if (value) {
          element.setAttribute(key, '');
        }
      } else {
        element.setAttribute(key, String(value));
      }
    }
  });

  // Add children
  vnode.children.forEach((child) => {
    element.appendChild(renderToDOM(child));
  });

  // Call _onMounted callback after element is rendered
  if (vnode.props._onMounted && typeof vnode.props._onMounted === 'function') {
    vnode.props._onMounted(element);
  }

  return element;
}

/**
 * mount - Attach a VNode to a real DOM container
 * @param vnode - Virtual node to mount
 * @param container - DOM element to mount to
 */
export function mount(vnode: VNode, container: HTMLElement): void {
  rootVNode = vnode;
  rootContainer = container;
  const domNode = renderToDOM(vnode);
  container.appendChild(domNode);
}

/**
 * Global render function for re-rendering
 */
let globalContainer: HTMLElement | null = null;
let globalVNode: VNode | null = null;

export function setGlobalRender(
  vnode: VNode,
  container: HTMLElement
): void {
  globalVNode = vnode;
  globalContainer = container;
}

function render(): void {
  if (globalContainer && globalVNode) {
    globalContainer.innerHTML = '';
    mount(globalVNode, globalContainer);
  }
}

export function rerender(vnode: VNode, container: HTMLElement): void {
  setGlobalRender(vnode, container);
  render();
}

// ============================================================
// PART 5: Utilities
// ============================================================

/**
 * h - Shorthand for createElement
 */
export const h = createElement;

/**
 * Fragment shorthand
 */
export const Fragment = createFragment;

/**
 * Helper to create fragments with JSX syntax
 */
export function Fragment_component(props: ComponentProps): VNode {
  const children = Array.isArray(props.children)
    ? props.children
    : props.children
      ? [props.children]
      : [];
  return createFragment(null, ...children);
}
