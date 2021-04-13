(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('inferno')) :
    typeof define === 'function' && define.amd ? define(['exports', 'inferno'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Inferno = global.Inferno || {}, global.Inferno));
}(this, (function (exports, inferno) { 'use strict';

    var ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';
    function isNullOrUndef(o) {
        return o === void 0 || o === null;
    }
    function isInvalid(o) {
        return o === null || o === false || o === true || o === void 0;
    }
    function isFunction(o) {
        return typeof o === 'function';
    }
    function isNull(o) {
        return o === null;
    }
    function throwError(message) {
        if (!message) {
            message = ERROR_MSG;
        }
        throw new Error(("Inferno Error: " + message));
    }
    function warning(message) {
        // tslint:disable-next-line:no-console
        console.error(message);
    }

    function isSameInnerHTML(dom, innerHTML) {
        var tempdom = document.createElement('i');
        tempdom.innerHTML = innerHTML;
        return tempdom.innerHTML === dom.innerHTML;
    }
    function findLastDOMFromVNode(vNode) {
        var flags;
        var children;
        while (vNode) {
            flags = vNode.flags;
            if (flags & 2033 /* DOMRef */) {
                return vNode.dom;
            }
            children = vNode.children;
            if (flags & 8192 /* Fragment */) {
                vNode = vNode.childFlags === 2 /* HasVNodeChildren */ ? children : children[children.length - 1];
            }
            else if (flags & 4 /* ComponentClass */) {
                vNode = children.$LI;
            }
            else {
                vNode = children;
            }
        }
        return null;
    }
    function isSamePropsInnerHTML(dom, props) {
        return Boolean(props && props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html && isSameInnerHTML(dom, props.dangerouslySetInnerHTML.__html));
    }
    function hydrateComponent(vNode, parentDOM, dom, context, isSVG, isClass, lifecycle, animations) {
        var type = vNode.type;
        var ref = vNode.ref;
        var props = vNode.props || inferno.EMPTY_OBJ;
        var currentNode;
        if (isClass) {
            var instance = inferno._CI(vNode, type, props, context, isSVG, lifecycle);
            var input = instance.$LI;
            currentNode = hydrateVNode(input, parentDOM, dom, instance.$CX, isSVG, lifecycle, animations);
            inferno._MCCC(ref, instance, lifecycle, animations);
        }
        else {
            var input$1 = inferno._HI(inferno._RFC(vNode, context));
            currentNode = hydrateVNode(input$1, parentDOM, dom, context, isSVG, lifecycle, animations);
            vNode.children = input$1;
            inferno._MFCC(vNode, lifecycle, animations);
        }
        return currentNode;
    }
    function hydrateChildren(parentVNode, parentNode, currentNode, context, isSVG, lifecycle, animations) {
        var childFlags = parentVNode.childFlags;
        var children = parentVNode.children;
        var props = parentVNode.props;
        var flags = parentVNode.flags;
        if (childFlags !== 1 /* HasInvalidChildren */) {
            if (childFlags === 2 /* HasVNodeChildren */) {
                if (isNull(currentNode)) {
                    inferno._M(children, parentNode, context, isSVG, null, lifecycle, animations);
                }
                else {
                    currentNode = hydrateVNode(children, parentNode, currentNode, context, isSVG, lifecycle, animations);
                    currentNode = currentNode ? currentNode.nextSibling : null;
                }
            }
            else if (childFlags === 16 /* HasTextChildren */) {
                if (isNull(currentNode)) {
                    parentNode.appendChild(document.createTextNode(children));
                }
                else if (parentNode.childNodes.length !== 1 || currentNode.nodeType !== 3) {
                    parentNode.textContent = children;
                }
                else {
                    if (currentNode.nodeValue !== children) {
                        currentNode.nodeValue = children;
                    }
                }
                currentNode = null;
            }
            else if (childFlags & 12 /* MultipleChildren */) {
                var prevVNodeIsTextNode = false;
                for (var i = 0, len = children.length; i < len; ++i) {
                    var child = children[i];
                    if (isNull(currentNode) || (prevVNodeIsTextNode && (child.flags & 16 /* Text */) > 0)) {
                        inferno._M(child, parentNode, context, isSVG, currentNode, lifecycle, animations);
                    }
                    else {
                        currentNode = hydrateVNode(child, parentNode, currentNode, context, isSVG, lifecycle, animations);
                        currentNode = currentNode ? currentNode.nextSibling : null;
                    }
                    prevVNodeIsTextNode = (child.flags & 16 /* Text */) > 0;
                }
            }
            // clear any other DOM nodes, there should be only a single entry for the root
            if ((flags & 8192 /* Fragment */) === 0) {
                var nextSibling = null;
                while (currentNode) {
                    nextSibling = currentNode.nextSibling;
                    parentNode.removeChild(currentNode);
                    currentNode = nextSibling;
                }
            }
        }
        else if (!isNull(parentNode.firstChild) && !isSamePropsInnerHTML(parentNode, props)) {
            parentNode.textContent = ''; // dom has content, but VNode has no children remove everything from DOM
            if (flags & 448 /* FormElement */) {
                // If element is form element, we need to clear defaultValue also
                parentNode.defaultValue = '';
            }
        }
    }
    function hydrateElement(vNode, parentDOM, dom, context, isSVG, lifecycle, animations) {
        var props = vNode.props;
        var className = vNode.className;
        var flags = vNode.flags;
        var ref = vNode.ref;
        isSVG = isSVG || (flags & 32 /* SvgElement */) > 0;
        if (dom.nodeType !== 1 || dom.tagName.toLowerCase() !== vNode.type) {
            {
                warning("Inferno hydration: Server-side markup doesn't match client-side markup");
            }
            inferno._ME(vNode, null, context, isSVG, null, lifecycle, animations);
            parentDOM.replaceChild(vNode.dom, dom);
        }
        else {
            vNode.dom = dom;
            hydrateChildren(vNode, dom, dom.firstChild, context, isSVG, lifecycle, animations);
            if (!isNull(props)) {
                inferno._MP(vNode, flags, props, dom, isSVG, animations);
            }
            if (isNullOrUndef(className)) {
                if (dom.className !== '') {
                    dom.removeAttribute('class');
                }
            }
            else if (isSVG) {
                dom.setAttribute('class', className);
            }
            else {
                dom.className = className;
            }
            inferno._MR(ref, dom, lifecycle);
        }
        return vNode.dom;
    }
    function hydrateText(vNode, parentDOM, dom) {
        if (dom.nodeType !== 3) {
            parentDOM.replaceChild((vNode.dom = document.createTextNode(vNode.children)), dom);
        }
        else {
            var text = vNode.children;
            if (dom.nodeValue !== text) {
                dom.nodeValue = text;
            }
            vNode.dom = dom;
        }
        return vNode.dom;
    }
    function hydrateFragment(vNode, parentDOM, dom, context, isSVG, lifecycle, animations) {
        var children = vNode.children;
        if (vNode.childFlags === 2 /* HasVNodeChildren */) {
            hydrateText(children, parentDOM, dom);
            return children.dom;
        }
        hydrateChildren(vNode, parentDOM, dom, context, isSVG, lifecycle, animations);
        return findLastDOMFromVNode(children[children.length - 1]);
    }
    function hydrateVNode(vNode, parentDOM, currentDom, context, isSVG, lifecycle, animations) {
        var flags = (vNode.flags |= 16384 /* InUse */);
        if (flags & 14 /* Component */) {
            return hydrateComponent(vNode, parentDOM, currentDom, context, isSVG, (flags & 4 /* ComponentClass */) > 0, lifecycle, animations);
        }
        if (flags & 481 /* Element */) {
            return hydrateElement(vNode, parentDOM, currentDom, context, isSVG, lifecycle, animations);
        }
        if (flags & 16 /* Text */) {
            return hydrateText(vNode, parentDOM, currentDom);
        }
        if (flags & 512 /* Void */) {
            return (vNode.dom = currentDom);
        }
        if (flags & 8192 /* Fragment */) {
            return hydrateFragment(vNode, parentDOM, currentDom, context, isSVG, lifecycle, animations);
        }
        {
            throwError(("hydrate() expects a valid VNode, instead it received an object with the type \"" + (typeof vNode) + "\"."));
        }
        throwError();
        return null;
    }
    function hydrate(input, parentDOM, callback) {
        var dom = parentDOM.firstChild;
        if (isNull(dom)) {
            {
                warning("Inferno hydration: Server-side markup doesn't match client-side markup");
            }
            inferno.render(input, parentDOM, callback);
        }
        else {
            var lifecycle = [];
            var animations = new inferno.AnimationQueues();
            if (!isInvalid(input)) {
                dom = hydrateVNode(input, parentDOM, dom, {}, false, lifecycle, animations);
            }
            // clear any other DOM nodes, there should be only a single entry for the root
            while (dom && (dom = dom.nextSibling)) {
                parentDOM.removeChild(dom);
            }
            if (lifecycle.length > 0) {
                var listener;
                while ((listener = lifecycle.shift()) !== undefined) {
                    listener();
                }
            }
        }
        parentDOM.$V = input;
        if (isFunction(callback)) {
            callback();
        }
    }

    exports.hydrate = hydrate;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
