import { Component, EMPTY_OBJ, Fragment, _CI, _HI, _M, _MCCC, _ME, _MFCC, _MP, _MR, __render, createComponentVNode, createFragment, createPortal, createRef, createRenderer, createTextVNode, createVNode, directClone, findDOMfromVNode, forwardRef, getFlagsForElementVnode, linkEvent, normalizeProps, options, rerender } from 'inferno';
export { Component, EMPTY_OBJ, Fragment, _CI, _HI, _M, _MCCC, _ME, _MFCC, _MP, _MR, __render, createComponentVNode, createFragment, createPortal, createRef, createRenderer, createTextVNode, createVNode, directClone, findDOMfromVNode, forwardRef, getFlagsForElementVnode, linkEvent, normalizeProps, options, rerender } from 'inferno';
import { hydrate } from 'inferno-hydrate';
export { hydrate } from 'inferno-hydrate';
import { cloneVNode } from 'inferno-clone-vnode';
export { cloneVNode as cloneElement, cloneVNode } from 'inferno-clone-vnode';
import { createClass } from 'inferno-create-class';
export { createClass } from 'inferno-create-class';
import { createElement } from 'inferno-create-element';
export { createElement } from 'inferno-create-element';
import { findDOMNode } from 'inferno-extras';
export { findDOMNode } from 'inferno-extras';

const isArray = Array.isArray;
function isNullOrUndef(o) {
    return o === void 0 || o === null;
}
function isInvalid(o) {
    return o === null || o === false || o === true || o === void 0;
}
function isFunction(o) {
    return typeof o === 'function';
}
function isString(o) {
    return typeof o === 'string';
}
function isNumber(o) {
    return typeof o === 'number';
}
function isNull(o) {
    return o === null;
}

function isValidElement(obj) {
    const isValidObject = typeof obj === 'object' && !isNull(obj);
    if (!isValidObject) {
        return false;
    }
    return (obj.flags & (14 /* Component */ | 481 /* Element */)) > 0;
}

/**
 * @module Inferno-Compat
 */
/**
 * Inlined PropTypes, there is propType checking ATM.
 */
// tslint:disable-next-line:no-empty
function proptype() { }
proptype.isRequired = proptype;
const getProptype = () => proptype;
const PropTypes = {
    any: getProptype,
    array: proptype,
    arrayOf: getProptype,
    bool: proptype,
    checkPropTypes: () => null,
    element: getProptype,
    func: proptype,
    instanceOf: getProptype,
    node: getProptype,
    number: proptype,
    object: proptype,
    objectOf: getProptype,
    oneOf: getProptype,
    oneOfType: getProptype,
    shape: getProptype,
    string: proptype,
    symbol: proptype
};

/**
 * This is a list of all SVG attributes that need special casing,
 * namespacing, or boolean value assignment.
 *
 * When adding attributes to this list, be sure to also add them to
 * the `possibleStandardNames` module to ensure casing and incorrect
 * name warnings.
 *
 * SVG Attributes List:
 * https://www.w3.org/TR/SVG/attindex.html
 * SMIL Spec:
 * https://www.w3.org/TR/smil
 */
const ATTRS = [
    'accent-height',
    'alignment-baseline',
    'arabic-form',
    'baseline-shift',
    'cap-height',
    'clip-path',
    'clip-rule',
    'color-interpolation',
    'color-interpolation-filters',
    'color-profile',
    'color-rendering',
    'dominant-baseline',
    'enable-background',
    'fill-opacity',
    'fill-rule',
    'flood-color',
    'flood-opacity',
    'font-family',
    'font-size',
    'font-size-adjust',
    'font-stretch',
    'font-style',
    'font-constiant',
    'font-weight',
    'glyph-name',
    'glyph-orientation-horizontal',
    'glyph-orientation-vertical',
    'horiz-adv-x',
    'horiz-origin-x',
    'image-rendering',
    'letter-spacing',
    'lighting-color',
    'marker-end',
    'marker-mid',
    'marker-start',
    'overline-position',
    'overline-thickness',
    'paint-order',
    'panose-1',
    'pointer-events',
    'rendering-intent',
    'shape-rendering',
    'stop-color',
    'stop-opacity',
    'strikethrough-position',
    'strikethrough-thickness',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'text-anchor',
    'text-decoration',
    'text-rendering',
    'underline-position',
    'underline-thickness',
    'unicode-bidi',
    'unicode-range',
    'units-per-em',
    'v-alphabetic',
    'v-hanging',
    'v-ideographic',
    'v-mathematical',
    'vector-effect',
    'vert-adv-y',
    'vert-origin-x',
    'vert-origin-y',
    'word-spacing',
    'writing-mode',
    'x-height',
    'xlink:actuate',
    'xlink:arcrole',
    'xlink:href',
    'xlink:role',
    'xlink:show',
    'xlink:title',
    'xlink:type',
    'xml:base',
    'xmlns:xlink',
    'xml:lang',
    'xml:space'
];
const InfernoCompatPropertyMap = {
    htmlFor: 'for',
    onDoubleClick: 'onDblClick'
};
const CAMELIZE = /[\-:]([a-z])/g;
const capitalize = (token) => token[1].toUpperCase();
ATTRS.forEach((original) => {
    const reactName = original.replace(CAMELIZE, capitalize);
    InfernoCompatPropertyMap[reactName] = original;
});

function getNumberStyleValue(style, value) {
    switch (style) {
        case 'animation-iteration-count':
        case 'border-image-outset':
        case 'border-image-slice':
        case 'border-image-width':
        case 'box-flex':
        case 'box-flex-group':
        case 'box-ordinal-group':
        case 'column-count':
        case 'fill-opacity':
        case 'flex':
        case 'flex-grow':
        case 'flex-negative':
        case 'flex-order':
        case 'flex-positive':
        case 'flex-shrink':
        case 'flood-opacity':
        case 'font-weight':
        case 'grid-column':
        case 'grid-row':
        case 'line-clamp':
        case 'line-height':
        case 'opacity':
        case 'order':
        case 'orphans':
        case 'stop-opacity':
        case 'stroke-dasharray':
        case 'stroke-dashoffset':
        case 'stroke-miterlimit':
        case 'stroke-opacity':
        case 'stroke-width':
        case 'tab-size':
        case 'widows':
        case 'z-index':
        case 'zoom':
            return value;
        default:
            return value + 'px';
    }
}
const uppercasePattern = /[A-Z]/g;
function hyphenCase(str) {
    return str.replace(uppercasePattern, '-$&').toLowerCase();
}

options.reactStyles = true;
function unmountComponentAtNode(container) {
    __render(null, container, null, null);
    return true;
}
function flatten(arr, result) {
    for (let i = 0, len = arr.length; i < len; ++i) {
        const value = arr[i];
        if (isArray(value)) {
            flatten(value, result);
        }
        else {
            result.push(value);
        }
    }
    return result;
}
const ARR = [];
const Children = {
    map(children, fn, ctx) {
        if (isNullOrUndef(children)) {
            return children;
        }
        children = Children.toArray(children);
        if (ctx) {
            fn = fn.bind(ctx);
        }
        return children.map(fn);
    },
    forEach(children, fn, ctx) {
        if (isNullOrUndef(children)) {
            return;
        }
        children = Children.toArray(children);
        if (ctx) {
            fn = fn.bind(ctx);
        }
        for (let i = 0, len = children.length; i < len; ++i) {
            const child = isInvalid(children[i]) ? null : children[i];
            fn(child, i, children);
        }
    },
    count(children) {
        children = Children.toArray(children);
        return children.length;
    },
    only(children) {
        children = Children.toArray(children);
        if (children.length !== 1) {
            throw new Error('Children.only() expects only one child.');
        }
        return children[0];
    },
    toArray(children) {
        if (isNullOrUndef(children)) {
            return [];
        }
        // We need to flatten arrays here,
        // because React does it also and application level code might depend on that behavior
        if (isArray(children)) {
            const result = [];
            flatten(children, result);
            return result;
        }
        return ARR.concat(children);
    }
};
Component.prototype.isReactComponent = {};
const version = '15.4.2';
const validLineInputs = {
    date: true,
    'datetime-local': true,
    email: true,
    month: true,
    number: true,
    password: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true
};
function normalizeGenericProps(props) {
    for (const prop in props) {
        const mappedProp = InfernoCompatPropertyMap[prop];
        if (mappedProp && props[prop] && mappedProp !== prop) {
            props[mappedProp] = props[prop];
            props[prop] = void 0;
        }
        if (options.reactStyles && prop === 'style') {
            const styles = props.style;
            if (styles && !isString(styles)) {
                const newStyles = {};
                for (const s in styles) {
                    const value = styles[s];
                    const hyphenStr = hyphenCase(s);
                    newStyles[hyphenStr] = isNumber(value) ? getNumberStyleValue(hyphenStr, value) : value;
                }
                props.style = newStyles;
            }
        }
    }
}
function normalizeFormProps(name, props) {
    if ((name === 'input' || name === 'textarea') && props.type !== 'radio' && props.onChange) {
        const type = props.type && props.type.toLowerCase();
        let eventName;
        if (!type || validLineInputs[type]) {
            eventName = 'oninput';
        }
        if (eventName && !props[eventName]) {
            props[eventName] = props.onChange;
            props.onChange = void 0;
        }
    }
}
// we need to add persist() to Event (as React has it for synthetic events)
// this is a hack and we really shouldn't be modifying a global object this way,
// but there isn't a performant way of doing this apart from trying to proxy
// every prop event that starts with "on", i.e. onClick or onKeyPress
// but in reality devs use onSomething for many things, not only for
// input events
if (typeof Event !== 'undefined') {
    const eventProtoType = Event.prototype;
    if (!eventProtoType.persist) {
        // tslint:disable-next-line:no-empty
        eventProtoType.persist = function () { };
    }
}
function iterableToArray(iterable) {
    let iterStep;
    const tmpArr = [];
    do {
        iterStep = iterable.next();
        tmpArr.push(iterStep.value);
    } while (!iterStep.done);
    return tmpArr;
}
const g = typeof window === 'undefined' ? global : window;
const hasSymbolSupport = typeof g.Symbol !== 'undefined';
const symbolIterator = hasSymbolSupport ? g.Symbol.iterator : '';
const oldCreateVNode = options.createVNode;
options.createVNode = (vNode) => {
    const children = vNode.children;
    let props = vNode.props;
    if (isNullOrUndef(props)) {
        props = vNode.props = {};
    }
    // React supports iterable children, in addition to Array-like
    if (hasSymbolSupport && !isNull(children) && typeof children === 'object' && !isArray(children) && isFunction(children[symbolIterator])) {
        vNode.children = iterableToArray(children[symbolIterator]());
    }
    if (!isNullOrUndef(children) && isNullOrUndef(props.children)) {
        props.children = children;
    }
    if (vNode.flags & 14 /* Component */) {
        if (isString(vNode.type)) {
            vNode.flags = getFlagsForElementVnode(vNode.type);
            if (props) {
                normalizeProps(vNode);
            }
        }
    }
    const flags = vNode.flags;
    if (flags & 448 /* FormElement */) {
        normalizeFormProps(vNode.type, props);
    }
    if (flags & 481 /* Element */) {
        if (vNode.className) {
            props.className = vNode.className;
        }
        normalizeGenericProps(props);
    }
    if (oldCreateVNode) {
        oldCreateVNode(vNode);
    }
};
// Credit: preact-compat - https://github.com/developit/preact-compat :)
function shallowDiffers(a, b) {
    let i;
    for (i in a) {
        if (!(i in b)) {
            return true;
        }
    }
    for (i in b) {
        if (a[i] !== b[i]) {
            return true;
        }
    }
    return false;
}
class PureComponent extends Component {
    shouldComponentUpdate(props, state) {
        return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
    }
}
class WrapperComponent extends Component {
    getChildContext() {
        // tslint:disable-next-line
        return this.props.context;
    }
    render(props) {
        return props.children;
    }
}
function unstable_renderSubtreeIntoContainer(parentComponent, vNode, container, callback) {
    const wrapperVNode = createComponentVNode(4 /* ComponentClass */, WrapperComponent, {
        children: vNode,
        context: parentComponent.context
    });
    render(wrapperVNode, container, null);
    const component = vNode.children;
    if (callback) {
        // callback gets the component as context, no other argument.
        callback.call(component);
    }
    return component;
}
function createFactory(type) {
    return createElement.bind(null, type);
}
function render(rootInput, container, cb = null, context = EMPTY_OBJ) {
    __render(rootInput, container, cb, context);
    const input = container.$V;
    if (input && input.flags & 14 /* Component */) {
        return input.children;
    }
}
// Mask React global in browser enviornments when React is not used.
if (typeof window !== 'undefined' && typeof window.React === 'undefined') {
    const exports = {
        Children,
        Component,
        EMPTY_OBJ,
        Fragment,
        PropTypes,
        PureComponent,
        // Internal methods
        _CI,
        _HI,
        _M,
        _MCCC,
        _ME,
        _MFCC,
        _MP,
        _MR,
        __render,
        // Public methods
        cloneElement: cloneVNode,
        cloneVNode,
        createClass,
        createComponentVNode,
        createElement,
        createFactory,
        createFragment,
        createPortal,
        createRef,
        createRenderer,
        createTextVNode,
        createVNode,
        directClone,
        findDOMNode,
        findDOMfromVNode,
        forwardRef,
        getFlagsForElementVnode,
        hydrate,
        isValidElement,
        linkEvent,
        normalizeProps,
        options,
        render,
        rerender,
        unmountComponentAtNode,
        unstable_renderSubtreeIntoContainer,
        version
    };
    window.React = exports;
    window.ReactDOM = exports;
}
var index = {
    Children,
    Component,
    EMPTY_OBJ,
    Fragment,
    PropTypes,
    PureComponent,
    // Internal methods
    _CI,
    _HI,
    _M,
    _MCCC,
    _ME,
    _MFCC,
    _MP,
    _MR,
    __render,
    // Public methods
    cloneElement: cloneVNode,
    cloneVNode,
    createClass,
    createComponentVNode,
    createElement,
    createFactory,
    createFragment,
    createPortal,
    createRef,
    createRenderer,
    createTextVNode,
    createVNode,
    directClone,
    findDOMNode,
    findDOMfromVNode,
    forwardRef,
    getFlagsForElementVnode,
    hydrate,
    isValidElement,
    linkEvent,
    normalizeProps,
    options,
    render,
    rerender,
    unmountComponentAtNode,
    unstable_renderSubtreeIntoContainer,
    version
};

export default index;
export { Children, PropTypes, PureComponent, createFactory, isValidElement, render, unmountComponentAtNode, unstable_renderSubtreeIntoContainer, version };
