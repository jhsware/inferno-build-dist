import hoistNonReactStatics from 'hoist-non-inferno-statics';
import { Component, normalizeProps, createComponentVNode } from 'inferno';
import { bindActionCreators } from 'redux';

const CLEARED = null;
// tslint:disable-next-line:no-empty
const nullSubscriptionHandler = () => { };
const nullListenerCollection = {
    // tslint:disable-next-line:no-empty
    clear: () => { },
    // tslint:disable-next-line:no-empty
    notify: () => { },
    subscribe: (_) => nullSubscriptionHandler
};
const createListenerCollection = () => {
    // the current/next pattern is copied from redux's createStore code.
    let current = [];
    let next = [];
    return {
        clear: () => {
            next = CLEARED;
            current = CLEARED;
        },
        notify: () => {
            const listeners = (current = next);
            for (let i = 0; i < listeners.length; ++i) {
                listeners[i]();
            }
        },
        subscribe: (listener) => {
            let isSubscribed = true;
            if (next === current) {
                next = current.slice();
            }
            next.push(listener);
            return () => {
                if (!isSubscribed || current === null) {
                    return;
                }
                isSubscribed = false;
                if (next === current) {
                    next = current.slice();
                }
                next.splice(next.indexOf(listener), 1);
            };
        }
    };
};
class Subscription {
    constructor(store, parentSub, onStateChange) {
        this.store = store;
        this.parentSub = parentSub;
        this.onStateChange = onStateChange;
        this.unsubscribe = null;
        this.listeners = nullListenerCollection;
    }
    addNestedSub(listener) {
        this.trySubscribe();
        return this.listeners.subscribe(listener);
    }
    notifyNestedSubs() {
        this.listeners.notify();
    }
    isSubscribed() {
        return Boolean(this.unsubscribe);
    }
    trySubscribe() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.onStateChange) : this.store.subscribe(this.onStateChange);
            this.listeners = createListenerCollection();
        }
    }
    tryUnsubscribe() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
            this.listeners.clear();
            this.listeners = nullListenerCollection;
        }
    }
}

function combineFrom(first, second) {
    const out = {};
    if (first) {
        for (const key in first) {
            out[key] = first[key];
        }
    }
    if (second) {
        for (const key in second) {
            out[key] = second[key];
        }
    }
    return out;
}

let hotReloadingVersion = 0;
const dummyState = {};
// tslint:disable-next-line:no-empty
const noop = () => { };
const makeSelectorStateful = (sourceSelector, store) => {
    // wrap the selector in an object that tracks its results between runs.
    const selector = {
        error: null,
        props: {},
        run: function runComponentSelector(props) {
            try {
                const nextProps = sourceSelector(store.getState(), props);
                if (nextProps !== selector.props || selector.error) {
                    selector.shouldComponentUpdate = true;
                    selector.props = nextProps;
                    selector.error = null;
                }
            }
            catch (e) {
                selector.shouldComponentUpdate = true;
                selector.error = e;
            }
        },
        shouldComponentUpdate: false
    };
    return selector;
};
// TODO: Move
const invariant = (test, error) => {
    if (!test) {
        throw new Error(error);
    }
};
function getDefaultName(name) {
    return `ConnectAdvanced(${name})`;
}
function connectAdvanced(selectorFactory, { getDisplayName = getDefaultName, methodName = 'connectAdvanced', renderCountProp = null, shouldHandleStateChanges = true, storeKey = 'store', withRef = false, ...connectOptions }) {
    const subscriptionKey = storeKey + 'Subscription';
    const version = hotReloadingVersion++;
    const wrapWithConnect = (WrappedComponent) => {
        invariant(typeof WrappedComponent === 'function', `You must pass a component to the function returned by ` + `connect. Instead received ${WrappedComponent}`);
        const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
        const displayName = getDisplayName(wrappedComponentName);
        const selectorFactoryOptions = combineFrom(connectOptions, {
            WrappedComponent,
            displayName,
            getDisplayName,
            methodName,
            renderCountProp,
            shouldHandleStateChanges,
            storeKey,
            withRef,
            wrappedComponentName
        });
        class Connect extends Component {
            constructor(props, context) {
                super(props, context);
                this.version = version;
                this.state = {};
                this.renderCount = 0;
                this.store = this.props[storeKey] || this.context[storeKey];
                this.propsMode = Boolean(props[storeKey]);
                this.setWrappedInstance = this.setWrappedInstance.bind(this);
                invariant(!!this.store, `Could not find "${storeKey}" in either the context or ` +
                    `props of "${displayName}". ` +
                    `Either wrap the root component in a <Provider>, ` +
                    `or explicitly pass "${storeKey}" as a prop to "${displayName}".`);
                this.initSelector();
                this.initSubscription();
            }
            getChildContext() {
                // If this component received store from props, its subscription should be transparent
                // to any descendants receiving store+subscription from context; it passes along
                // subscription passed to it. Otherwise, it shadows the parent subscription, which allows
                // Connect to control ordering of notifications to flow top-down.
                const subscription = this.propsMode ? null : this.subscription;
                return {
                    [subscriptionKey]: subscription || this.context[subscriptionKey]
                };
            }
            componentWillMount() {
                if (!shouldHandleStateChanges || this.$SSR) {
                    return;
                }
                this.subscription.trySubscribe();
                this.selector.run(this.props);
            }
            componentWillReceiveProps(nextProps) {
                this.selector.run(nextProps);
            }
            shouldComponentUpdate() {
                return this.selector.shouldComponentUpdate;
            }
            componentWillUnmount() {
                if (this.subscription) {
                    this.subscription.tryUnsubscribe();
                }
                // these are just to guard against extra memory leakage if a parent element doesn't
                // dereference this instance properly, such as an async callback that never finishes
                this.subscription = null;
                this.notifyNestedSubs = noop;
                this.store = null;
                this.selector.run = noop;
                this.selector.shouldComponentUpdate = false;
            }
            getWrappedInstance() {
                invariant(withRef, `To access the wrapped instance, you need to specify ` + `{ withRef: true } in the options argument of the ${methodName}() call.`);
                return this.wrappedInstance;
            }
            setWrappedInstance(ref) {
                this.wrappedInstance = ref;
            }
            initSelector() {
                const sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions);
                this.selector = makeSelectorStateful(sourceSelector, this.store);
                this.selector.run(this.props);
            }
            initSubscription() {
                if (!shouldHandleStateChanges) {
                    return;
                }
                // parentSub's source should match where store came from: props vs. context. A component
                // connected to the store via props shouldn't use subscription from context, or vice versa.
                const parentSub = (this.propsMode ? this.props : this.context)[subscriptionKey];
                this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this));
                // `notifyNestedSubs` is duplicated to handle the case where the component is  unmounted in
                // the middle of the notification loop, where `this.subscription` will then be null. An
                // extra null check every change can be avoided by copying the method onto `this` and then
                // replacing it with a no-op on unmount. This can probably be avoided if Subscription's
                // listeners logic is changed to not call listeners that have been unsubscribed in the
                // middle of the notification loop.
                this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription);
            }
            onStateChange() {
                this.selector.run(this.props);
                if (!this.selector.shouldComponentUpdate) {
                    this.notifyNestedSubs();
                }
                else {
                    this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate;
                    this.setState(dummyState);
                }
            }
            notifyNestedSubsOnComponentDidUpdate() {
                // `componentDidUpdate` is conditionally implemented when `onStateChange` determines it
                // needs to notify nested subs. Once called, it unimplements itself until further state
                // changes occur. Doing it this way vs having a permanent `componentDidMount` that does
                // a boolean check every time avoids an extra method call most of the time, resulting
                // in some perf boost.
                this.componentDidUpdate = undefined;
                this.notifyNestedSubs();
            }
            isSubscribed() {
                return Boolean(this.subscription && this.subscription.isSubscribed());
            }
            addExtraProps(props) {
                if (!renderCountProp) {
                    return props;
                }
                // make a shallow copy so that fields added don't leak to the original selector.
                // this is especially important for 'ref' since that's a reference back to the component
                // instance. a singleton memoized selector would then be holding a reference to the
                // instance, preventing the instance from being garbage collected, and that would be bad
                const withExtras = combineFrom(props, null);
                if (renderCountProp) {
                    withExtras[renderCountProp] = this.renderCount++;
                }
                if (this.propsMode && this.subscription) {
                    withExtras[subscriptionKey] = this.subscription;
                }
                return withExtras;
            }
            render() {
                const selector = this.selector;
                selector.shouldComponentUpdate = false;
                if (selector.error) {
                    throw selector.error;
                }
                else {
                    return normalizeProps(createComponentVNode(2 /* ComponentUnknown */, WrappedComponent, this.addExtraProps(selector.props), null, withRef ? this.setWrappedInstance : null));
                }
            }
        }
        Connect.displayName = displayName;
        Connect.WrappedComponent = WrappedComponent;
        return hoistNonReactStatics(Connect, WrappedComponent);
    };
    return wrapWithConnect;
}

class Provider extends Component {
    constructor(props, context) {
        super(props, context);
        this.store = props.store;
    }
    getChildContext() {
        return { store: this.store, storeSubscription: null };
    }
    // Don't infer the return type. It may be expanded and cause reference errors
    // in the output.
    render() {
        return this.props.children;
    }
}
Provider.displayName = 'Provider';

const hasOwn = Object.prototype.hasOwnProperty;
const shallowEqual = (a, b) => {
    if (a === b) {
        return true;
    }
    let countA = 0;
    let countB = 0;
    for (const key in a) {
        if (hasOwn.call(a, key) && a[key] !== b[key]) {
            return false;
        }
        countA++;
    }
    for (const key in b) {
        if (hasOwn.call(b, key)) {
            countB++;
        }
    }
    return countA === countB;
};

// TODO: Type
const wrapMapToPropsConstant = (getConstant) => {
    return (dispatch, options) => {
        const constant = getConstant(dispatch, options);
        const constantSelector = () => constant;
        constantSelector.dependsOnOwnProps = false;
        return constantSelector;
    };
};
// dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
// whether mapToProps needs to be invoked when props have changed.
//
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..
const getDependsOnOwnProps = (mapToProps) => mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? !!mapToProps.dependsOnOwnProps : mapToProps.length !== 1;
// Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
// this function wraps mapToProps in a proxy function which does several things:
//
//  * Detects whether the mapToProps function being called depends on props, which
//    is used by selectorFactory to decide if it should reinvoke on props changes.
//
//  * On first call, handles mapToProps if returns another function, and treats that
//    new function as the true mapToProps for subsequent calls.
//
//  * On first call, verifies the first result is a plain object, in order to warn
//    the developer that their mapToProps function is not returning a valid result.
//
const wrapMapToPropsFunc = (mapToProps, methodName) => {
    return (_dispatch, { displayName }) => {
        const proxy = (stateOrDispatch, ownProps) => proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
        proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
        proxy.mapToProps = (stateOrDispatch, ownProps) => {
            proxy.mapToProps = mapToProps;
            let props = proxy(stateOrDispatch, ownProps);
            if (typeof props === 'function') {
                proxy.mapToProps = props;
                proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
                props = proxy(stateOrDispatch, ownProps);
            }
            return props;
        };
        return proxy;
    };
};

const whenMapDispatchToPropsIsFunction = (mapDispatchToProps) => typeof mapDispatchToProps === 'function' ? wrapMapToPropsFunc(mapDispatchToProps) : undefined;
const whenMapDispatchToPropsIsMissing = (mapDispatchToProps) => (!mapDispatchToProps ? wrapMapToPropsConstant((dispatch) => ({ dispatch })) : undefined);
const whenMapDispatchToPropsIsObject = (mapDispatchToProps) => mapDispatchToProps && typeof mapDispatchToProps === 'object'
    ? wrapMapToPropsConstant((dispatch) => bindActionCreators(mapDispatchToProps, dispatch))
    : undefined;
const defaultMapDispatchToPropsFactories = [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];

const whenMapStateToPropsIsFunction = (mapStateToProps) => typeof mapStateToProps === 'function' ? wrapMapToPropsFunc(mapStateToProps) : undefined;
const whenMapStateToPropsIsMissing = (mapStateToProps) => (!mapStateToProps ? wrapMapToPropsConstant(() => ({})) : undefined);
const defaultMapStateToPropsFactories = [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];

const defaultMergeProps = (stateProps, dispatchProps, ownProps) => {
    const merged = combineFrom(ownProps, stateProps);
    if (dispatchProps) {
        for (const key in dispatchProps) {
            merged[key] = dispatchProps[key];
        }
    }
    return merged;
};
const wrapMergePropsFunc = (mergeProps) => {
    return (_dispatch, { displayName, pure, areMergedPropsEqual }) => {
        let hasRunOnce = false;
        let mergedProps;
        return function (stateProps, dispatchProps, ownProps) {
            const nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);
            if (hasRunOnce) {
                if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) {
                    mergedProps = nextMergedProps;
                }
            }
            else {
                hasRunOnce = true;
                mergedProps = nextMergedProps;
            }
            return mergedProps;
        };
    };
};
const whenMergePropsIsFunction = (mergeProps) => (typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined);
const whenMergePropsIsOmitted = (mergeProps) => (!mergeProps ? () => defaultMergeProps : undefined);
const defaultMergePropsFactories = [whenMergePropsIsFunction, whenMergePropsIsOmitted];

const impureFinalPropsSelectorFactory = (mapStateToProps, mapDispatchToProps, mergeProps, dispatch) => {
    return (state, ownProps) => {
        return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
    };
};
const pureFinalPropsSelectorFactory = (mapStateToProps, mapDispatchToProps, mergeProps, dispatch, { areStatesEqual, areOwnPropsEqual, areStatePropsEqual }) => {
    let hasRunAtLeastOnce = false;
    let state;
    let ownProps;
    let stateProps;
    let dispatchProps;
    let mergedProps;
    const handleFirstCall = (firstState, firstOwnProps) => {
        state = firstState;
        ownProps = firstOwnProps;
        stateProps = mapStateToProps(state, ownProps);
        dispatchProps = mapDispatchToProps(dispatch, ownProps);
        mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        hasRunAtLeastOnce = true;
        return mergedProps;
    };
    const handleNewPropsAndNewState = () => {
        stateProps = mapStateToProps(state, ownProps);
        if (mapDispatchToProps.dependsOnOwnProps) {
            dispatchProps = mapDispatchToProps(dispatch, ownProps);
        }
        mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        return mergedProps;
    };
    const handleNewProps = () => {
        if (mapStateToProps.dependsOnOwnProps) {
            stateProps = mapStateToProps(state, ownProps);
        }
        if (mapDispatchToProps.dependsOnOwnProps) {
            dispatchProps = mapDispatchToProps(dispatch, ownProps);
        }
        mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        return mergedProps;
    };
    const handleNewState = () => {
        const nextStateProps = mapStateToProps(state, ownProps);
        const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
        stateProps = nextStateProps;
        if (statePropsChanged) {
            mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        }
        return mergedProps;
    };
    const handleSubsequentCalls = (nextState, nextOwnProps) => {
        const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
        const stateChanged = !areStatesEqual(nextState, state);
        state = nextState;
        ownProps = nextOwnProps;
        if (propsChanged && stateChanged) {
            return handleNewPropsAndNewState();
        }
        if (propsChanged) {
            return handleNewProps();
        }
        if (stateChanged) {
            return handleNewState();
        }
        return mergedProps;
    };
    const pureFinalPropsSelector = (nextState, nextOwnProps) => hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
    return pureFinalPropsSelector;
};
// If pure is true, the selector returned by selectorFactory will memoize its results,
// allowing connectAdvanced's shouldComponentUpdate to return false if final
// props have not changed. If false, the selector will always return a new
// object and shouldComponentUpdate will always return true.
const defaultSelectorFactory = (dispatch, { initMapStateToProps, initMapDispatchToProps, initMergeProps, ...opts }) => {
    const options = opts; // trick typescript
    const mapStateToProps = initMapStateToProps(dispatch, options);
    const mapDispatchToProps = initMapDispatchToProps(dispatch, options);
    const mergeProps = initMergeProps(dispatch, options);
    const selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;
    return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
};

const match = (arg, factories, name) => {
    for (let i = factories.length - 1; i >= 0; i--) {
        const result = factories[i](arg);
        if (result) {
            return result;
        }
    }
    return (_dispatch, options) => {
        throw new Error(`Invalid value of type ${typeof arg} for ${name} argument when connecting component ${options.wrappedComponentName}.`);
    };
};
const strictEqual = (a, b) => a === b;
// createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios
const createConnect = ({ connectHOC = connectAdvanced, mapStateToPropsFactories = defaultMapStateToPropsFactories, mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories, mergePropsFactories = defaultMergePropsFactories, selectorFactory = defaultSelectorFactory } = {}) => (mapStateToProps, mapDispatchToProps, mergeProps, { pure = true, areStatesEqual = strictEqual, areOwnPropsEqual = shallowEqual, areStatePropsEqual = shallowEqual, areMergedPropsEqual = shallowEqual, ...extraOptions } = {}) => {
    const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    const initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    const initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
    return connectHOC(selectorFactory, combineFrom({
        // used in error messages
        methodName: 'connect',
        // used to compute Connect's displayName from the wrapped component's displayName.
        // tslint:disable-next-line:object-literal-sort-keys
        getDisplayName: (name) => `Connect(${name})`,
        // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
        shouldHandleStateChanges: !!mapStateToProps,
        // passed through to selectorFactory
        areMergedPropsEqual,
        areOwnPropsEqual,
        areStatePropsEqual,
        areStatesEqual,
        initMapDispatchToProps,
        initMapStateToProps,
        initMergeProps,
        pure
    }, extraOptions /* any extra options args can override defaults of connect or connectAdvanced */));
};
const connect = createConnect();

function wrapActionCreators(actionCreators) {
    return function (dispatch) {
        return bindActionCreators(actionCreators, dispatch);
    };
}

export { Provider, connect, connectAdvanced, wrapActionCreators };
