import {ContainerConfiguration, Scope} from 'typescript-ioc';
import {TracerApi} from './tracer.api';
import {jaegerTracerFactory} from './jaeger-tracer';

const config: ContainerConfiguration[] = [
  {
    bind: TracerApi,
    factory: jaegerTracerFactory,
    scope: Scope.Singleton
  }
];

export default config;