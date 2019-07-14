import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class UnloginInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const request: Request = context.switchToHttp().getRequest();
    // if (!request.session.user) {
    //   response.redirect('/manage/user/login');
    //   throw new HttpException('用户未登录', HttpStatus.FORBIDDEN);
    // }
    return next.handle();
  }
}
