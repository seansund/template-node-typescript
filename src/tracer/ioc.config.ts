import {ContainerConfiguration, ObjectFactory, Scope} from 'typescript-ioc';
import {TracerApi} from './tracer.api';

const useJaeger: boolean = process.env.JAEGER_ENABLED === "true";
const factory: ObjectFactory = useJaeger ? require('./jaeger-tracer').default : require('./logger-tracer').default;

const config: ContainerConfiguration[] = [
  {
    bind: TracerApi,
    factory,
    scope: Scope.Singleton
  }
];

export default config;