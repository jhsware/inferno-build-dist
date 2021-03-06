import { Component, createComponentVNode, linkEvent, createVNode } from 'inferno';
import { createPath, parsePath, createBrowserHistory, createHashHistory, createMemoryHistory, createLocation as createLocation$1, locationsAreEqual } from 'history';
import pathToRegexp from 'path-to-regexp-es6';
import hoistNonReactStatics from 'hoist-non-inferno-statics';

const isArray = Array.isArray;
function isInvalid(o) {
    return o === null || o === false || o === true || o === void 0;
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

function invariant(condition, format, a, b, c, d, e, f) {
    if (!condition) {
        let error;
        if (format === undefined) {
            error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
        }
        else {
            const args = [a, b, c, d, e, f];
            let argIndex = 0;
            error = new Error(format.replace(/%s/g, function () {
                return args[argIndex++];
            }));
            error.name = 'Invariant Violation';
        }
        error.framesToPop = 1; // we don't care about invariant's own frame
        throw error;
    }
}

/**
 * The public API for putting history on context.
 */
class Router extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            match: this.computeMatch(props.history.location.pathname)
        };
    }
    getChildContext() {
        const childContext = combineFrom(this.context.router, null);
        childContext.history = this.props.history;
        childContext.route = {
            location: childContext.history.location,
            match: this.state.match
        };
        return {
            router: childContext
        };
    }
    computeMatch(pathname) {
        return {
            isExact: pathname === '/',
            params: {},
            path: '/',
            url: '/'
        };
    }
    componentWillMount() {
        const { history } = this.props;
        // Do this here so we can setState when a <Redirect> changes the
        // location in componentWillMount. This happens e.g. when doing
        // server rendering using a <StaticRouter>.
        this.unlisten = history.listen(() => {
            this.setState({
                match: this.computeMatch(history.location.pathname)
            });
        });
    }
    componentWillUnmount() {
        this.unlisten();
    }
    render(props) {
        return props.children;
    }
}

function addLeadingSlash(path) {
    return path.charAt(0) === '/' ? path : '/' + path;
}
// tslint:disable-next-line:no-empty
const noop = () => { };
class StaticRouter extends Component {
    constructor() {
        super(...arguments);
        this.createHref = (path) => addLeadingSlash(this.props.basename + createURL(path));
        this.handlePush = (location) => {
            const { basename, context } = this.props;
            context.action = 'PUSH';
            context.location = addBasename(basename, createLocation(location));
            context.url = createURL(context.location);
        };
        this.handleReplace = (location) => {
            const { basename, context } = this.props;
            context.action = 'REPLACE';
            context.location = addBasename(basename, createLocation(location));
            context.url = createURL(context.location);
        };
        // tslint:disable-next-line:no-empty
        this.handleListen = () => noop;
        // tslint:disable-next-line:no-empty
        this.handleBlock = () => noop;
    }
    getChildContext() {
        return {
            router: {
                staticContext: this.props.context
            }
        };
    }
    render({ basename, context, location, ...props }) {
        return createComponentVNode(4 /* ComponentClass */, Router, combineFrom(props, {
            history: {
                action: 'POP',
                block: this.handleBlock,
                createHref: this.createHref,
                go: staticHandler('go'),
                goBack: staticHandler('goBack'),
                goForward: staticHandler('goForward'),
                listen: this.handleListen,
                location: stripBasename(basename, createLocation(location)),
                push: this.handlePush,
                replace: this.handleReplace
            }
        }));
    }
}
StaticRouter.defaultProps = {
    basename: '',
    location: '/'
};
function normalizeLocation({ pathname = '/', search, hash }) {
    return {
        hash: (hash || '') === '#' ? '' : hash,
        pathname,
        search: (search || '') === '?' ? '' : search
    };
}
function addBasename(basename, location) {
    if (!basename) {
        return location;
    }
    return combineFrom(location, { pathname: addLeadingSlash(basename) + location.pathname });
}
function stripBasename(basename, location) {
    if (!basename) {
        return location;
    }
    const base = addLeadingSlash(basename);
    if (location.pathname.indexOf(base) !== 0) {
        return location;
    }
    return combineFrom(location, { pathname: location.pathname.substr(base.length) });
}
function createLocation(location) {
    return typeof location === 'string' ? parsePath(location) : normalizeLocation(location);
}
function createURL(location) {
    return typeof location === 'string' ? location : createPath(location);
}
function staticHandler(methodName) {
    return () => {
        invariant(false, 'You cannot %s with <StaticRouter>', methodName);
    };
}

class BrowserRouter extends Component {
    constructor(props, context) {
        super(props, context);
        this.history = createBrowserHistory(props);
    }
    render() {
        return createComponentVNode(4 /* ComponentClass */, Router, {
            children: this.props.children,
            history: this.history
        });
    }
}

class HashRouter extends Component {
    constructor(props, context) {
        super(props, context);
        this.history = createHashHistory(props);
    }
    render() {
        return createComponentVNode(4 /* ComponentClass */, Router, {
            children: this.props.children,
            history: this.history
        });
    }
}

class MemoryRouter extends Component {
    constructor(props, context) {
        super(props, context);
        this.history = createMemoryHistory(props);
    }
    render() {
        return createComponentVNode(4 /* ComponentClass */, Router, {
            children: this.props.children,
            history: this.history
        });
    }
}

const patternCache = {};
const cacheLimit = 10000;
let cacheCount = 0;
const compilePath = (pattern, options) => {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
    const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});
    if (cache[pattern]) {
        return cache[pattern];
    }
    const keys = [];
    const re = pathToRegexp(pattern, keys, options);
    const compiledPattern = { re, keys };
    if (cacheCount < cacheLimit) {
        cache[pattern] = compiledPattern;
        cacheCount++;
    }
    return compiledPattern;
};
/**
 * Public API for matching a URL pathname to a path pattern.
 */
function matchPath(pathname, options) {
    if (typeof options === 'string') {
        options = { path: options };
    }
    const { path = '/', exact = false, strict = false, sensitive = false } = options;
    const { re, keys } = compilePath(path, { end: exact, strict, sensitive });
    const match = re.exec(pathname);
    if (!match) {
        return null;
    }
    const [url, ...values] = match;
    const isExact = pathname === url;
    if (exact && !isExact) {
        return null;
    }
    return {
        isExact,
        params: keys.reduce((memo, key, index) => {
            memo[key.name] = values[index];
            return memo;
        }, {}),
        path,
        url: path === '/' && url === '' ? '/' : url // the matched portion of the URL
    };
}

/**
 * The public API for matching a single path and rendering.
 */
class Route extends Component {
    getChildContext() {
        const childContext = combineFrom(this.context.router, null);
        childContext.route = {
            location: this.props.location || this.context.router.route.location,
            match: this.state.match
        };
        return {
            router: childContext
        };
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            match: this.computeMatch(props, context.router)
        };
    }
    computeMatch({ computedMatch, location, path, strict, exact, sensitive }, router) {
        if (computedMatch) {
            // <Switch> already computed the match for us
            return computedMatch;
        }
        const { route } = router;
        const pathname = (location || route.location).pathname;
        return path ? matchPath(pathname, { path, strict, exact, sensitive }) : route.match;
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            match: this.computeMatch(nextProps, nextContext.router)
        });
    }
    render() {
        const { match } = this.state;
        const { children, component, render } = this.props;
        const { history, route, staticContext } = this.context.router;
        const location = this.props.location || route.location;
        const props = { match, location, history, staticContext };
        if (component) {
            return match ? createComponentVNode(2 /* ComponentUnknown */, component, props) : null;
        }
        if (render) {
            return match ? render(props, this.context) : null;
        }
        if (typeof children === 'function') {
            return children(props);
        }
        return children;
    }
}

function getMatch({ path, exact, strict, sensitive, from }, route, location) {
    const pathProp = path || from;
    return pathProp ? matchPath(location.pathname, { path: pathProp, exact, strict, sensitive }) : route.match;
}
function extractMatchFromChildren(children, route, location) {
    let match;
    let _child;
    if (isArray(children)) {
        for (let i = 0; i < children.length; ++i) {
            _child = children[i];
            if (isArray(_child)) {
                const nestedMatch = extractMatchFromChildren(_child, route, location);
                match = nestedMatch.match;
                _child = nestedMatch._child;
            }
            else {
                match = getMatch(_child.props, route, location);
            }
            if (match) {
                break;
            }
        }
    }
    else {
        match = getMatch(children.props, route, location);
        _child = children;
    }
    return { match, _child };
}
class Switch extends Component {
    render() {
        const { route } = this.context.router;
        const { children } = this.props;
        const location = this.props.location || route.location;
        if (isInvalid(children)) {
            return null;
        }
        const { match, _child } = extractMatchFromChildren(children, route, location);
        if (match) {
            return createComponentVNode(_child.flags, _child.type, combineFrom(_child.props, { location, computedMatch: match }));
        }
        return null;
    }
}

const isModifiedEvent = (event) => Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
function handleClick({ props, context }, event) {
    if (props.onClick) {
        props.onClick(event);
    }
    if (!event.defaultPrevented && // onClick prevented default
        event.button === 0 && // ignore everything but left clicks
        !props.target && // let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
        event.preventDefault();
        const { history } = context.router;
        const { replace = false, to } = props;
        if (replace) {
            history.replace(to);
        }
        else {
            history.push(to);
        }
    }
}
/**
 * The public API for rendering a history-aware <a>.
 */
function Link(props, context) {
    const { replace, children, className, to = '', innerRef, ...rest } = props;
    invariant(context.router, 'You should not use <Link> outside a <Router>');
    const href = context.router.history.createHref(typeof to === 'string' ? { pathname: to } : to);
    const newProps = combineFrom(rest, null);
    newProps.href = href;
    newProps.onClick = linkEvent({
        context,
        props
    }, handleClick);
    return createVNode(1 /* HtmlElement */, 'a', className, children, 0 /* UnknownChildren */, newProps, null, innerRef);
}

function filter(i) {
    return i;
}
/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
function NavLink({ to, exact, strict, onClick, location: linkLocation, activeClassName = 'active', className, activeStyle, style, isActive: getIsActive, ariaCurrent = 'true', ...rest }) {
    function linkComponent({ location, match }) {
        const isActive = Boolean(getIsActive ? getIsActive(match, location) : match);
        return createComponentVNode(8 /* ComponentFunction */, Link, combineFrom({
            'aria-current': isActive && ariaCurrent,
            className: isActive ? [className, activeClassName].filter(filter).join(' ') : className,
            onClick,
            style: isActive ? combineFrom(style, activeStyle) : style,
            to
        }, rest));
    }
    return createComponentVNode(4 /* ComponentClass */, Route, {
        children: linkComponent,
        exact,
        location: linkLocation,
        path: typeof to === 'object' ? to.pathname : to,
        strict
    });
}

/**
 * The public API for matching a single path and rendering.
 */
class Prompt extends Component {
    enable(message) {
        if (this.unblock) {
            this.unblock();
        }
        this.unblock = this.context.router.history.block(message);
    }
    disable() {
        if (this.unblock) {
            this.unblock();
            this.unblock = null;
        }
    }
    componentWillMount() {
        invariant(this.context.router, 'You should not use <Prompt> outside a <Router>');
        if (this.props.when) {
            this.enable(this.props.message);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.when) {
            if (!this.props.when || this.props.message !== nextProps.message) {
                this.enable(nextProps.message);
            }
        }
        else {
            this.disable();
        }
    }
    componentWillUnmount() {
        this.disable();
    }
    render() {
        return null;
    }
}

class Redirect extends Component {
    isStatic() {
        return this.context.router && this.context.router.staticContext;
    }
    componentWillMount() {
        invariant(this.context.router, 'You should not use <Redirect> outside a <Router>');
        if (this.isStatic()) {
            this.perform();
        }
    }
    componentDidMount() {
        if (!this.isStatic()) {
            this.perform();
        }
    }
    componentDidUpdate(prevProps) {
        const prevTo = createLocation$1(prevProps.to);
        const nextTo = createLocation$1(this.props.to);
        if (locationsAreEqual(prevTo, nextTo)) {
            // tslint:disable-next-line:no-console
            console.error(`You tried to redirect to the same route you're currently on: "${nextTo.pathname}${nextTo.search}"`);
            return;
        }
        this.perform();
    }
    perform() {
        const { history } = this.context.router;
        const { push = false, to } = this.props;
        if (push) {
            history.push(to);
        }
        else {
            history.replace(to);
        }
    }
    render() {
        return null;
    }
}

/**
 * A public higher-order component to access the imperative API
 */
function withRouter(Com) {
    const C = function (props) {
        const { wrappedComponentRef, ...remainingProps } = props;
        return createComponentVNode(4 /* ComponentClass */, Route, {
            render(routeComponentProps) {
                return createComponentVNode(2 /* ComponentUnknown */, Com, combineFrom(remainingProps, routeComponentProps), null, wrappedComponentRef);
            }
        });
    };
    C.displayName = `withRouter(${Com.displayName || Com.name})`;
    C.WrappedComponent = Com;
    return hoistNonReactStatics(C, Com);
}

export { BrowserRouter, HashRouter, Link, MemoryRouter, NavLink, Prompt, Redirect, Route, Router, StaticRouter, Switch, matchPath, withRouter };
