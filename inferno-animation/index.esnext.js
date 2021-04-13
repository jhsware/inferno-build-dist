import { Component } from 'inferno';

function isNullOrUndef(o) {
    return o === void 0 || o === null;
}
function isFunction(o) {
    return typeof o === 'function';
}
function isString(o) {
    return typeof o === 'string';
}

function filterEmpty(c) {
    return c !== '';
}
function getClassNameList(className) {
    return className.split(' ').filter(filterEmpty);
}
function addClassName(node, className) {
    if (isString(className)) {
        const classNameList = getClassNameList(className);
        for (let i = 0; i < classNameList.length; i++) {
            node.classList.add(classNameList[i]);
        }
    }
}
function removeClassName(node, className) {
    if (isString(className)) {
        const classNameList = getClassNameList(className);
        for (let i = 0; i < classNameList.length; i++) {
            node.classList.remove(classNameList[i]);
        }
    }
}
function forceReflow() {
    return document.body.clientHeight;
}
function setDisplay(node, value) {
    const oldVal = node.style.getPropertyValue('display');
    if (oldVal !== value) {
        if (value !== undefined) {
            node.style.setProperty('display', value);
        }
        else {
            node.style.removeProperty('display');
            _cleanStyle(node);
        }
    }
    return oldVal;
}
function _cleanStyle(node) {
    if (!node.style) {
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute
        node.removeAttribute('style');
    }
}
function getDimensions(node) {
    const tmpDisplay = node.style.getPropertyValue('display');
    // The `display: none;` workaround was added to support Bootstrap animations in
    // https://github.com/jhsware/inferno-bootstrap/blob/be4a17bff5e785b993a66a2927846cd463fecae3/src/Modal/AnimateModal.js
    // we should consider deprecating this, or providing a different solution for
    // those who only do normal animations.
    const isDisplayNone = window.getComputedStyle(node).getPropertyValue('display') === 'none';
    if (isDisplayNone) {
        node.style.setProperty('display', 'block');
    }
    const tmp = node.getBoundingClientRect();
    if (isDisplayNone) {
        // node.style.display = tmpDisplay
        node.style.setProperty('display', tmpDisplay);
        _cleanStyle(node);
    }
    return {
        height: tmp.height,
        width: tmp.width
    };
}
function setDimensions(node, width, height) {
    node.style.width = width + 'px';
    node.style.height = height + 'px';
}
function clearDimensions(node) {
    node.style.width = node.style.height = '';
}
function _getMaxTransitionDuration(nodes) {
    let nrofTransitions = 0;
    let maxDuration = 0;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node)
            continue;
        const cs = window.getComputedStyle(node);
        const dur = cs.getPropertyValue('transition-duration').split(',');
        const del = cs.getPropertyValue('transition-delay').split(',');
        const props = cs.getPropertyValue('transition-property').split(',');
        for (const prop in props) {
            const fixedProp = prop.trim();
            if (fixedProp[0] === '-') {
                const tmp = fixedProp.split('-').splice(2).join('-');
                // Since I increase number of transition events to expect by
                // number of durations found I need to remove browser prefix
                // variations of the same property
                if (fixedProp.indexOf(tmp) >= 0) {
                    nrofTransitions--;
                }
            }
        }
        let animTimeout = 0;
        for (let j = 0; j < dur.length; j++) {
            const duration = dur[j];
            const delay = del[j];
            animTimeout += parseFloat(duration) + parseFloat(delay);
        }
        nrofTransitions += dur.length;
        // Max duration should be equal to the longest animation duration
        // of all found transitions including delay
        if (animTimeout > maxDuration) {
            maxDuration = animTimeout;
        }
    }
    return {
        maxDuration,
        nrofTransitions
    };
}
const transitionEndName = (function () {
    const elementStyle = document.createElement('div').style;
    // tslint:disable:object-literal-sort-keys
    const transitions = {
        transition: 'transitionend',
        OTransition: 'oTransitionEnd',
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd'
    };
    // tslint:enable:object-literal-sort-keys
    for (const t in transitions) {
        if (elementStyle[t] !== undefined) {
            return transitions[t];
        }
    }
})();
function setAnimationTimeout(onTransitionEnd, rootNode, maxDuration) {
    if (rootNode.nodeName === 'IMG' && !rootNode.complete) {
        // Image animations should wait for loaded until the timeout is started, otherwise animation will be cut short
        // due to loading delay
        rootNode.addEventListener('load', () => {
            setTimeout(() => onTransitionEnd({ target: rootNode, timeout: true }), Math.round(maxDuration * 1000) + 100);
        });
    }
    else {
        setTimeout(() => onTransitionEnd({ target: rootNode, timeout: true }), Math.round(maxDuration * 1000) + 100);
    }
}
/**
 * You need to pass the root element and ALL animated children that have transitions,
 * if there are any,  so the timeout is set to the longest duration. Otherwise there
 * will be animations that fail to complete before the timeout is triggered.
 *
 * @param nodes a list of nodes that have transitions that are part of this animation
 * @param callback callback when all transitions of participating nodes are completed
 */
function registerTransitionListener(nodes, callback) {
    const rootNode = nodes[0];
    /**
     * Here comes the transition event listener
     */
    const transitionDuration = _getMaxTransitionDuration(nodes);
    const maxDuration = transitionDuration.maxDuration;
    let nrofTransitionsLeft = transitionDuration.nrofTransitions;
    let done = false;
    const onTransitionEnd = (event) => {
        // Make sure this is an actual event
        if (!event || done) {
            return;
        }
        if (!event.timeout) {
            // Make sure it isn't a child that is triggering the event
            let goAhead = false;
            for (let i = 0; i < nodes.length; i++) {
                // Note: Check for undefined nodes (happens when an animated el doesn't have children)
                if (nodes[i] !== undefined && event.target === nodes[i]) {
                    goAhead = true;
                    break;
                }
            }
            if (!goAhead)
                return;
            // Wait for all transitions
            if (--nrofTransitionsLeft > 0) {
                return;
            }
        }
        // This is it...
        done = true;
        /**
         * Perform cleanup
         */
        rootNode.removeEventListener(transitionEndName, onTransitionEnd, false);
        if (isFunction(callback)) {
            callback();
        }
    };
    rootNode.addEventListener(transitionEndName, onTransitionEnd, false);
    // Fallback if transitionend fails
    // This is disabled during debug so we can set breakpoints
    // WARNING: If the callback isn't called, the DOM nodes won't be removed
    {
        setAnimationTimeout(onTransitionEnd, rootNode, maxDuration);
    }
}

function getAnimationClass(animationProp, prefix) {
    let animCls;
    if (!isNullOrUndef(animationProp) && typeof animationProp === 'object') {
        animCls = animationProp;
    }
    else {
        const animationName = animationProp || 'inferno-animation';
        animCls = {
            active: `${animationName}${prefix}-active`,
            end: `${animationName}${prefix}-end`,
            start: `${animationName}${prefix}`
        };
    }
    return animCls;
}
function componentDidAppear(dom, props) {
    const { start, end, active } = getAnimationClass(props.animation, '-enter');
    // 1. Get height and set start of animation
    const { width, height } = getDimensions(dom);
    addClassName(dom, start);
    forceReflow();
    // 2. Activate transition
    addClassName(dom, active);
    // 3. Set an animation listener, code at end
    // Needs to be done after activating so timeout is calculated correctly
    registerTransitionListener([dom], function () {
        // *** Cleanup ***
        // 5. Remove the element
        clearDimensions(dom);
        removeClassName(dom, active);
        removeClassName(dom, end);
        // 6. Call callback to allow stuff to happen
        // Not currently used but this is where one could
        // add a call to something like this.didAppearDone
    });
    // 4. Activate target state
    requestAnimationFrame(() => {
        setDimensions(dom, width, height);
        removeClassName(dom, start);
        addClassName(dom, end);
    });
}
function componentWillDisappear(dom, props, callback) {
    const { start, end, active } = getAnimationClass(props.animation, '-leave');
    // 1. Get dimensions and set animation start state
    const { width, height } = getDimensions(dom);
    setDimensions(dom, width, height);
    addClassName(dom, start);
    // 2. Activate transitions
    addClassName(dom, active);
    // 3. Set an animation listener, code at end
    // Needs to be done after activating so timeout is calculated correctly
    registerTransitionListener([dom], function () {
        // *** Cleanup not needed since node is removed ***
        callback();
    });
    // 4. Activate target state
    requestAnimationFrame(() => {
        addClassName(dom, end);
        removeClassName(dom, start);
        clearDimensions(dom);
    });
}

class AnimatedComponent extends Component {
    componentDidAppear(dom) {
        componentDidAppear(dom, this.props);
    }
    componentWillDisappear(dom, callback) {
        componentWillDisappear(dom, this.props, callback);
    }
}

const utils = {
    addClassName,
    clearDimensions,
    forceReflow,
    getDimensions,
    registerTransitionListener,
    removeClassName,
    setDimensions,
    setDisplay
};

export { AnimatedComponent, componentDidAppear, componentWillDisappear, utils };
