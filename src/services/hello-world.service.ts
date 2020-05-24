import {Span, SpanOptions} from 'opentracing';
import {Inject} from 'typescript-ioc';

import {HelloWorldApi} from './hello-world.api';
import {TracerApi} from '../tracer';
import {infoEvent, traceResponse, traceStart} from '../util/opentracing/formatters';

export class HelloWorldService implements HelloWorldApi {
  @Inject
  private tracer: TracerApi;

  startSpan(methodName: string, tags?: any): Span {
    const options: SpanOptions = tags ? {tags} : {};

    return this.tracer.startSpan(`HelloWorldService.${methodName}`, options);
  }

  async greeting(name: string = 'World'): Promise<string> {
    const span: Span = this.startSpan('greeting');

    try {
      traceStart(span, {name});

      const result = `Hello, ${name}!`;

      traceResponse(span, {response: result});

      return result;
    } finally {
      span.finish();
    }
  }
}
