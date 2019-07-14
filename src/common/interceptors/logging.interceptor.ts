import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // 每个拦截器都有intercept()方法，它带有2个参数。第一个是ExecutionContext实例（与看守器完全相同的对象）
  // ExecutionContext继承自ArgumentsHost（第一次提到在这里）。
  // ArgumentsHost是传递给原始处理程序的参数的包装器，它根据应用程序的类型在引擎下包含不同的参数数组。
  // switchToRpc(): RpcArgumentsHost;
  // switchToHttp(): HttpArgumentsHost;
  // switchToWs(): WsArgumentsHost;
  // ExecutionContext提供的多一点点。它扩展了ArgumentsHost，而且提供了当前执行过程的更多详细信息。
  // getHandler(): Function; getHandler()将返回一个参考create()方法

  // intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> | Promise<Observable<R>>;
  // 第二个参数是 CallHandler。如果不手动调用 handle() 方法，则主处理程序根本不会进行求值。
  // 这是什么意思？基本上，CallHandler是一个包装执行流的对象，因此推迟了最终的处理程序执行
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { method, url } = request;
    const now = Date.now();
    return next.handle().pipe(
      tap(() =>
        Logger.log(
          `${method} ${url} ${context.getHandler().name} ${Date.now() - now}ms`,
          context.getClass().name,
        ),
      ),
    );
  }
}
