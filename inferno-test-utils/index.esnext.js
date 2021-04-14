import { Component, render, rerender } from 'inferno';

const ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';
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
function throwError(message) {
    if (!message) {
        message = ERROR_MSG;
    }
    throw new Error(`Inferno Error: ${message}`);
}

function isVNode$1(obj) {
    return Boolean(obj) && typeof obj === 'object' && isNumber(obj.flags) && obj.flags > 0;
}
function isTextVNode$1(obj) {
    return (obj.flags & 16 /* Text */) > 0;
}
function isFunctionalVNode$1(obj) {
    return isVNode$1(obj) && (obj.flags & 8 /* ComponentFunction */) > 0;
}
function isClassVNode$1(obj) {
    return isVNode$1(obj) && (obj.flags & 4 /* ComponentClass */) > 0;
}
function isComponentVNode$1(obj) {
    return isFunctionalVNode$1(obj) || isClassVNode$1(obj);
}
function getTagNameOfVNode$1(vNode) {
    return (vNode && vNode.dom && vNode.dom.tagName.toLowerCase()) || undefined;
}
function isDOMVNode$1(vNode) {
    return !isComponentVNode$1(vNode) && !isTextVNode$1(vNode) && (vNode.flags & 481 /* Element */) > 0;
}
class Wrapper$1 extends Component {
    render() {
        return this.props.children;
    }
}

// Jest Snapshot Utilities
// Jest formats it's snapshots prettily because it knows how to play with the React test renderer.
// Symbols and algorithm have been reversed from the following file:
// https://github.com/facebook/react/blob/v15.4.2/src/renderers/testing/ReactTestRenderer.js#L98
const symbolValue = typeof Symbol === 'undefined' ? 'react.test.json' : Symbol.for('react.test.json');
function createSnapshotObject(object) {
    Object.defineProperty(object, '$$typeof', {
        value: symbolValue
    });
    return object;
}
function removeChildren(item) {
    if (Array.isArray(item)) {
        for (let i = 0; i < item.length; ++i) {
            removeChildren(item[i]);
        }
    }
    else if (item && item.props) {
        if (item.props.hasOwnProperty('children')) {
            delete item.props.children;
        }
        removeChildren(item.children);
    }
}
function buildVNodeSnapshot(vNode) {
    const flags = vNode.flags;
    const children = vNode.children;
    let childVNode;
    if (flags & 4 /* ComponentClass */) {
        childVNode = buildVNodeSnapshot(children.$LI);
    }
    else if (flags & 8 /* ComponentFunction */) {
        childVNode = buildVNodeSnapshot(children);
    }
    if (vNode.childFlags === 2 /* HasVNodeChildren */) {
        childVNode = buildVNodeSnapshot(children);
    }
    else if (vNode.childFlags & 12 /* MultipleChildren */) {
        childVNode = [];
        for (let i = 0, len = children.length; i < len; ++i) {
            childVNode.push(buildVNodeSnapshot(children[i]));
        }
    }
    else if (vNode.childFlags & 16 /* HasTextChildren */) {
        childVNode = vNode.children + '';
    }
    if (flags & 481 /* Element */) {
        const snapShotProps = {};
        const props = vNode.props;
        if (props) {
            const keys = Object.keys(props);
            for (let i = 0; i < keys.length; ++i) {
                const key = keys[i];
                const value = props[key];
                if (value !== undefined) {
                    snapShotProps[key] = value;
                }
            }
        }
        if (!isNullOrUndef(vNode.className)) {
            snapShotProps.className = vNode.className;
        }
        // Jest expects children to always be array
        if (childVNode && !isArray(childVNode)) {
            childVNode = [childVNode];
        }
        return createSnapshotObject({
            children: childVNode,
            props: snapShotProps,
            type: getTagNameOfVNode$1(vNode)
        });
    }
    else if (flags & 16 /* Text */) {
        childVNode = vNode.children + '';
    }
    return childVNode;
}
function vNodeToSnapshot$1(vNode) {
    return buildVNodeSnapshot(vNode);
}
function renderToSnapshot$1(input) {
    render(input, document.createElement('div'));
    rerender(); // Flush all pending set state calls
    const snapshot = vNodeToSnapshot$1(input);
    removeChildren(snapshot);
    return snapshot;
}

// Type Checkers
function isVNodeOfType(obj, type) {
    return isVNode$1(obj) && obj.type === type;
}
function isDOMVNodeOfType(obj, type) {
    return isDOMVNode$1(obj) && obj.type === type;
}
function isFunctionalVNodeOfType(obj, type) {
    return isFunctionalVNode$1(obj) && obj.type === type;
}
function isClassVNodeOfType(obj, type) {
    return isClassVNode$1(obj) && obj.type === type;
}
function isComponentVNodeOfType(obj, type) {
    return (isFunctionalVNode$1(obj) || isClassVNode$1(obj)) && obj.type === type;
}
function isDOMElement(obj) {
    return Boolean(obj) && typeof obj === 'object' && obj.nodeType === 1 && isString(obj.tagName);
}
function isDOMElementOfType(obj, type) {
    return isDOMElement(obj) && isString(type) && obj.tagName.toLowerCase() === type.toLowerCase();
}
function isRenderedClassComponent(obj) {
    return Boolean(obj) && typeof obj === 'object' && isVNode$1(obj.$LI) && isFunction(obj.render) && isFunction(obj.setState);
}
function isRenderedClassComponentOfType(obj, type) {
    return isRenderedClassComponent(obj) && isFunction(type) && obj.constructor === type;
}
// Recursive Finder Functions
function findAllInRenderedTree(renderedTree, predicate) {
    if (isRenderedClassComponent(renderedTree)) {
        return findAllInVNodeTree(renderedTree.$LI, predicate);
    }
    else {
        return findAllInVNodeTree(renderedTree, predicate);
    }
}
function findAllInVNodeTree(vNodeTree, predicate) {
    if (isVNode$1(vNodeTree)) {
        let result = predicate(vNodeTree) ? [vNodeTree] : [];
        const children = vNodeTree.children;
        if (isRenderedClassComponent(children)) {
            result = result.concat(findAllInVNodeTree(children.$LI, predicate));
        }
        else if (isVNode$1(children)) {
            result = result.concat(findAllInVNodeTree(children, predicate));
        }
        else if (isArray(children)) {
            children.forEach((child) => {
                if (!isInvalid(child)) {
                    result = result.concat(findAllInVNodeTree(child, predicate));
                }
            });
        }
        return result;
    }
    else {
        throwError('findAllInVNodeTree(vNodeTree, predicate) vNodeTree must be a VNode instance');
    }
}
// Finder Helpers
function parseSelector(filter) {
    if (isArray(filter)) {
        return filter;
    }
    else if (isString(filter)) {
        return filter.trim().split(/\s+/);
    }
    else {
        return [];
    }
}
function findOneOf(tree, filter, name, finder) {
    const all = finder(tree, filter);
    if (all.length > 1) {
        throwError(`Did not find exactly one match (found ${all.length}) for ${name}: ${filter}`);
    }
    else {
        return all[0];
    }
}
// Scry Utilities
function scryRenderedDOMElementsWithClass(renderedTree, classNames) {
    return findAllInRenderedTree(renderedTree, (instance) => {
        if (isDOMVNode$1(instance)) {
            let domClassName = !isNullOrUndef(instance.dom) ? instance.dom.className : '';
            if (!isString(domClassName) && !isNullOrUndef(instance.dom) && isFunction(instance.dom.getAttribute)) {
                // SVG || null, probably
                domClassName = instance.dom.getAttribute('class') || '';
            }
            const domClassList = parseSelector(domClassName);
            return parseSelector(classNames).every((className) => {
                return domClassList.indexOf(className) !== -1;
            });
        }
        return false;
    }).map((instance) => instance.dom);
}
function scryRenderedDOMElementsWithTag(renderedTree, tagName) {
    return findAllInRenderedTree(renderedTree, (instance) => {
        return isDOMVNodeOfType(instance, tagName);
    }).map((instance) => instance.dom);
}
function scryRenderedVNodesWithType(renderedTree, type) {
    return findAllInRenderedTree(renderedTree, (instance) => isVNodeOfType(instance, type));
}
function scryVNodesWithType(vNodeTree, type) {
    return findAllInVNodeTree(vNodeTree, (instance) => isVNodeOfType(instance, type));
}
// Find Utilities
function findRenderedDOMElementWithClass(renderedTree, classNames) {
    return findOneOf(renderedTree, classNames, 'class', scryRenderedDOMElementsWithClass);
}
function findRenderedDOMElementWithTag(renderedTree, tagName) {
    return findOneOf(renderedTree, tagName, 'tag', scryRenderedDOMElementsWithTag);
}
function findRenderedVNodeWithType(renderedTree, type) {
    return findOneOf(renderedTree, type, 'component', scryRenderedVNodesWithType);
}
function findVNodeWithType(vNodeTree, type) {
    return findOneOf(vNodeTree, type, 'VNode', scryVNodesWithType);
}
function renderIntoContainer(input) {
    const container = document.createElement('div');
    render(input, container);
    const rootInput = container.$V;
    if (rootInput && rootInput.flags & 14 /* Component */) {
        return rootInput.children;
    }
    return rootInput;
}
const vNodeToSnapshot = vNodeToSnapshot$1;
const renderToSnapshot = renderToSnapshot$1;
const getTagNameOfVNode = getTagNameOfVNode$1;
const isClassVNode = isClassVNode$1;
const isComponentVNode = isComponentVNode$1;
const isDOMVNode = isDOMVNode$1;
const isFunctionalVNode = isFunctionalVNode$1;
const isTextVNode = isTextVNode$1;
const isVNode = isVNode$1;
const Wrapper = Wrapper$1;

export { Wrapper, findAllInRenderedTree, findAllInVNodeTree, findRenderedDOMElementWithClass, findRenderedDOMElementWithTag, findRenderedVNodeWithType, findVNodeWithType, getTagNameOfVNode, isClassVNode, isClassVNodeOfType, isComponentVNode, isComponentVNodeOfType, isDOMElement, isDOMElementOfType, isDOMVNode, isDOMVNodeOfType, isFunctionalVNode, isFunctionalVNodeOfType, isRenderedClassComponent, isRenderedClassComponentOfType, isTextVNode, isVNode, isVNodeOfType, renderIntoContainer, renderToSnapshot, scryRenderedDOMElementsWithClass, scryRenderedDOMElementsWithTag, scryRenderedVNodesWithType, scryVNodesWithType, vNodeToSnapshot };
