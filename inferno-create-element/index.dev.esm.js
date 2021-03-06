import { getFlagsForElementVnode, createComponentVNode, createFragment, createVNode } from 'inferno';

function isNullOrUndef(o) {
    return o === void 0 || o === null;
}
function isInvalid(o) {
    return o === null || o === false || o === true || o === void 0;
}
function isString(o) {
    return typeof o === 'string';
}
function isUndefined(o) {
    return o === void 0;
}

var componentHooks = {
    onComponentDidAppear: 1,
    onComponentDidMount: 1,
    onComponentDidUpdate: 1,
    onComponentShouldUpdate: 1,
    onComponentWillDisappear: 1,
    onComponentWillMount: 1,
    onComponentWillUnmount: 1,
    onComponentWillUpdate: 1
};
function createElement(type, props, _children) {
    var arguments$1 = arguments;

    {
        if (isInvalid(type)) {
            throw new Error('Inferno Error: createElement() name parameter cannot be undefined, null, false or true, It must be a string, class, function or forwardRef.');
        }
    }
    var children;
    var ref = null;
    var key = null;
    var className = null;
    var flags = 0;
    var newProps;
    var childLen = arguments.length - 2;
    if (childLen === 1) {
        children = _children;
    }
    else if (childLen > 1) {
        children = [];
        while (childLen-- > 0) {
            children[childLen] = arguments$1[childLen + 2];
        }
    }
    if (isString(type)) {
        flags = getFlagsForElementVnode(type);
        if (!isNullOrUndef(props)) {
            newProps = {};
            for (var prop in props) {
                if (prop === 'className' || prop === 'class') {
                    className = props[prop];
                }
                else if (prop === 'key') {
                    key = props.key;
                }
                else if (prop === 'children' && isUndefined(children)) {
                    children = props.children; // always favour children args over props
                }
                else if (prop === 'ref') {
                    ref = props.ref;
                }
                else {
                    if (prop === 'contenteditable') {
                        flags |= 4096 /* ContentEditable */;
                    }
                    newProps[prop] = props[prop];
                }
            }
        }
    }
    else {
        flags = 2 /* ComponentUnknown */;
        if (!isUndefined(children)) {
            if (!props) {
                props = {};
            }
            props.children = children;
        }
        if (!isNullOrUndef(props)) {
            newProps = {};
            for (var prop$1 in props) {
                if (prop$1 === 'key') {
                    key = props.key;
                }
                else if (prop$1 === 'ref') {
                    ref = props.ref;
                }
                else if (componentHooks[prop$1] === 1) {
                    if (!ref) {
                        ref = {};
                    }
                    ref[prop$1] = props[prop$1];
                }
                else {
                    newProps[prop$1] = props[prop$1];
                }
            }
        }
        return createComponentVNode(flags, type, newProps, key, ref);
    }
    if (flags & 8192 /* Fragment */) {
        return createFragment(childLen === 1 ? [children] : children, 0 /* UnknownChildren */, key);
    }
    return createVNode(flags, type, className, children, 0 /* UnknownChildren */, newProps, key, ref);
}

export { createElement };
