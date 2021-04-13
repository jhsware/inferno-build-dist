export { AnimatedComponent } from './AnimatedComponent';
export { componentDidAppear, componentWillDisappear, AnimationClass } from './animations';
import { addClassName, clearDimensions, forceReflow, getDimensions, registerTransitionListener, removeClassName, setDimensions, setDisplay } from './utils';
export declare const utils: {
    addClassName: typeof addClassName;
    clearDimensions: typeof clearDimensions;
    forceReflow: typeof forceReflow;
    getDimensions: typeof getDimensions;
    registerTransitionListener: typeof registerTransitionListener;
    removeClassName: typeof removeClassName;
    setDimensions: typeof setDimensions;
    setDisplay: typeof setDisplay;
};
