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
function warning(message) {
    // tslint:disable-next-line:no-console
    console.error(message);
}

function filterEmpty(c) {
    return c !== '';
}
function getClassNameList(className) {
    return className.split(' ').filter(filterEmpty);
}
function addClassName(node, className) {
    if (isString(className)) {
        var classNameList = getClassNameList(className);
        for (var i = 0; i < classNameList.length; i++) {
            node.classList.add(classNameList[i]);
        }
    }
}
function removeClassName(node, className) {
    if (isString(className)) {
        var classNameList = getClassNameList(className);
        for (var i = 0; i < classNameList.length; i++) {
            node.classList.remove(classNameList[i]);
        }
    }
}
function forceReflow() {
    return document.body.clientHeight;
}
function setDisplay(node, value) {
    var oldVal = node.style.getPropertyValue('display');
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
    var tmpDisplay = node.style.getPropertyValue('display');
    // The `display: none;` workaround was added to support Bootstrap animations in
    // https://github.com/jhsware/inferno-bootstrap/blob/be4a17bff5e785b993a66a2927846cd463fecae3/src/Modal/AnimateModal.js
    // we should consider deprecating this, or providing a different solution for
    // those who only do normal animations.
    var isDisplayNone = window.getComputedStyle(node).getPropertyValue('display') === 'none';
    if (isDisplayNone) {
        node.style.setProperty('display', 'block');
    }
    var tmp = node.getBoundingClientRect();
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
    var nrofTransitions = 0;
    var maxDuration = 0;
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (!node)
            { continue; }
        var cs = window.getComputedStyle(node);
        var dur = cs.getPropertyValue('transition-duration').split(',');
        var del = cs.getPropertyValue('transition-delay').split(',');
        var props = cs.getPropertyValue('transition-property').split(',');
        for (var prop in props) {
            var fixedProp = prop.trim();
            if (fixedProp[0] === '-') {
                var tmp = fixedProp.split('-').splice(2).join('-');
                // Since I increase number of transition events to expect by
                // number of durations found I need to remove browser prefix
                // variations of the same property
                if (fixedProp.indexOf(tmp) >= 0) {
                    nrofTransitions--;
                }
            }
        }
        var animTimeout = 0;
        for (var j = 0; j < dur.length; j++) {
            var duration = dur[j];
            var delay = del[j];
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
        maxDuration: maxDuration,
        nrofTransitions: nrofTransitions
    };
}
var transitionEndName = (function () {
    var elementStyle = document.createElement('div').style;
    // tslint:disable:object-literal-sort-keys
    var transitions = {
        transition: 'transitionend',
        OTransition: 'oTransitionEnd',
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd'
    };
    // tslint:enable:object-literal-sort-keys
    for (var t in transitions) {
        if (elementStyle[t] !== undefined) {
            return transitions[t];
        }
    }
})();
function setAnimationTimeout(onTransitionEnd, rootNode, maxDuration) {
    if (rootNode.nodeName === 'IMG' && !rootNode.complete) {
        // Image animations should wait for loaded until the timeout is started, otherwise animation will be cut short
        // due to loading delay
        rootNode.addEventListener('load', function () {
            setTimeout(function () { return onTransitionEnd({ target: rootNode, timeout: true }); }, Math.round(maxDuration * 1000) + 100);
        });
    }
    else {
        setTimeout(function () { return onTransitionEnd({ target: rootNode, timeout: true }); }, Math.round(maxDuration * 1000) + 100);
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
    var rootNode = nodes[0];
    /**
     * Here comes the transition event listener
     */
    var transitionDuration = _getMaxTransitionDuration(nodes);
    var maxDuration = transitionDuration.maxDuration;
    var nrofTransitionsLeft = transitionDuration.nrofTransitions;
    var done = false;
    var onTransitionEnd = function (event) {
        // Make sure this is an actual event
        if (!event || done) {
            return;
        }
        if (!event.timeout) {
            // Make sure it isn't a child that is triggering the event
            var goAhead = false;
            for (var i = 0; i < nodes.length; i++) {
                // Note: Check for undefined nodes (happens when an animated el doesn't have children)
                if (nodes[i] !== undefined && event.target === nodes[i]) {
                    goAhead = true;
                    break;
                }
            }
            if (!goAhead)
                { return; }
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
    if (!(isDebugAnimationsSet())) {
        setAnimationTimeout(onTransitionEnd, rootNode, maxDuration);
    }
    else {
        warning('You are in animation debugging mode and fallback timeouts aren\'t set. DOM nodes could be left behind.');
    }
}
function isDebugAnimationsSet() {
    return window.__INFERNO_ANIMATION_DEBUG__ === true;
}

function getAnimationClass(animationProp, prefix) {
    var animCls;
    if (!isNullOrUndef(animationProp) && typeof animationProp === 'object') {
        animCls = animationProp;
    }
    else {
        var animationName = animationProp || 'inferno-animation';
        animCls = {
            active: ("" + animationName + prefix + "-active"),
            end: ("" + animationName + prefix + "-end"),
            start: ("" + animationName + prefix)
        };
    }
    return animCls;
}
function componentDidAppear(dom, props) {
    var ref = getAnimationClass(props.animation, '-enter');
    var start = ref.start;
    var end = ref.end;
    var active = ref.active;
    // 1. Get height and set start of animation
    var ref$1 = getDimensions(dom);
    var width = ref$1.width;
    var height = ref$1.height;
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
    requestAnimationFrame(function () {
        setDimensions(dom, width, height);
        removeClassName(dom, start);
        addClassName(dom, end);
    });
}
function componentWillDisappear(dom, props, callback) {
    var ref = getAnimationClass(props.animation, '-leave');
    var start = ref.start;
    var end = ref.end;
    var active = ref.active;
    // 1. Get dimensions and set animation start state
    var ref$1 = getDimensions(dom);
    var width = ref$1.width;
    var height = ref$1.height;
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
    requestAnimationFrame(function () {
        addClassName(dom, end);
        removeClassName(dom, start);
        clearDimensions(dom);
    });
}

var AnimatedComponent = /*@__PURE__*/(function (Component) {
    function AnimatedComponent () {
        Component.apply(this, arguments);
    }

    if ( Component ) AnimatedComponent.__proto__ = Component;
    AnimatedComponent.prototype = Object.create( Component && Component.prototype );
    AnimatedComponent.prototype.constructor = AnimatedComponent;

    AnimatedComponent.prototype.componentDidAppear = function componentDidAppear$1 (dom) {
        componentDidAppear(dom, this.props);
    };
    AnimatedComponent.prototype.componentWillDisappear = function componentWillDisappear$1 (dom, callback) {
        componentWillDisappear(dom, this.props, callback);
    };

    return AnimatedComponent;
}(Component));

var utils = {
    addClassName: addClassName,
    clearDimensions: clearDimensions,
    forceReflow: forceReflow,
    getDimensions: getDimensions,
    registerTransitionListener: registerTransitionListener,
    removeClassName: removeClassName,
    setDimensions: setDimensions,
    setDisplay: setDisplay
};

export { AnimatedComponent, componentDidAppear, componentWillDisappear, utils };
