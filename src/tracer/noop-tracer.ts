import {ObjectFactory} from 'typescript-ioc';
import {Tracer, initGlobalTracer, globalTracer} from 'opentracing';

function initTracer() {
  const tracer: Tracer = new Tracer();

  initGlobalTracer(tracer);
}
initTracer();

export const noopTracerFactory: ObjectFactory = () => {
  return globalTracer();
}
