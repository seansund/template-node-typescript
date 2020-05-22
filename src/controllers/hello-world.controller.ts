import {GET, Path, PathParam} from 'typescript-rest';
import {Inject} from 'typescript-ioc';
import {HelloWorldApi} from '../services';
import {TracerApi} from '../tracer';
import {Span, SpanOptions} from 'opentracing';
import {infoEvent, responseEvent, traceError, traceResponse} from '../util/opentracing/formatters';

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
      span.log(infoEvent('Saying hello to someone'));

      const response: string = await this.service.greeting();

      traceResponse(span, {response});

      return response;
    } catch (error) {
      traceError(span, error);

      throw error;
    } finally {
      span.finish();
    }
  }

  @Path(':name')
  @GET
  async sayHello(@PathParam('name') name: string): Promise<string> {
    const span: Span = this.startSpan('sayHello', {'pathParam.name': name});

    try {
      span.log(infoEvent(`Saying hello to ${name}`));

      const response: string = await this.service.greeting(name);

      traceResponse(span, {response});

      return response;
    } catch (error) {
      traceError(span, error);

      throw error;
    } finally {
      span.finish();
    }
  }
}
