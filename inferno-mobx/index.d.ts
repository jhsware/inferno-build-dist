import { errorsReporter, inject, Observer, observer, renderReporter, trackComponents, useStaticRendering } from './observer';
import { Provider } from './Provider';
import { EventEmitter } from './utils/EventEmitter';
declare const onError: (fn: any) => () => void;
export { errorsReporter, inject, observer, onError, EventEmitter, Observer, Provider, renderReporter, trackComponents, useStaticRendering };
