import {GET, Path, PathParam} from 'typescript-rest';
import {Inject} from 'typescript-ioc';
import {HelloWorldApi} from '../services';
import {TracerApi} from '../tracer';
import {Span, SpanOptions} from 'opentracing';
import {infoEvent, responseEvent, traceError, traceResponse, traceStart} from '../util/opentracing/formatters';

@Path('/hello')
export class HelloWorldController {

  @Inject
  service: HelloWorldApi;
  @Inject
  tracer: TracerApi;

  startSpan(methodName: string, tags?: any): Span {
    const options: SpanOptions = tags ? {tags} : {};

    return this.tracer.startSpan(`HelloWorldController.${methodName}`, options);
  }

  @GET
  async sayHelloToUnknownUser(): Promise<string> {
    const span: Span = this.startSpan('sayHelloToUnknownUser');

    try {
      traceStart(span);

      const response: string = await this.service.greeting();

      traceResponse(span, {response});

      return response;
    } catch (error) {
      traceError(span, error, true);
    } finally {
      span.finish();
    }
  }

  @Path(':name')
  @GET
  async sayHello(@PathParam('name') name: string): Promise<string> {
    const span: Span = this.startSpan('sayHello', {'pathParam.name': name});

    try {
      traceStart<{name: string}>(span, {name});

      const response: string = await this.service.greeting(name);

      traceResponse(span, {response});

      return response;
    } catch (error) {
      traceError(span, error, true);
    } finally {
      span.finish();
    }
  }
}
