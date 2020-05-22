import {Span, SpanOptions} from 'opentracing';
import {Inject} from 'typescript-ioc';

import {HelloWorldApi} from './hello-world.api';
import {TracerApi} from '../tracer';
import {infoEvent} from '../util/opentracing/formatters';

export class HelloWorldService implements HelloWorldApi {
  @Inject
  private tracer: TracerApi;

  startSpan(methodName: string, tags?: any): Span {
    const options: SpanOptions = tags ? {tags} : {};

    return this.tracer.startSpan(`HelloWorldService.${methodName}`, options);
  }

  async greeting(name: string = 'World'): Promise<string> {
    const span: Span = this.startSpan('greeting', {name})

    try {
      span.log(infoEvent(`Generating greeting for ${name}`));

      return `Hello, ${name}!`;
    } finally {
      span.finish();
    }
  }
}
