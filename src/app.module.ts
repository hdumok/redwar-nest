import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { ExpressSessionMiddleware } from '@nest-middlewares/express-session';
import { CacheModule, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as CacheRedisStore from 'cache-manager-redis-store';
import * as ConnectRedis from 'connect-redis';
import * as session from 'express-session';

import { HttpErrorFilter } from './common/filters/http-error.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { UnloginInterceptor } from './common/interceptors/unlogin.interceptor';
import { UserModule } from './user/user.module';

/**
 * @Module() 定义一个模块，并管理这个模块的导入集合、控制器集合、提供者集合、导出集合
 */
@Module({
  imports: [
    CacheModule.register({
      store: CacheRedisStore,
      host: '127.0.0.1',
      port: 7379,
      password: '123456',
      db: 2,
    }),
    // TypeOrmModule.forRoot() 默认加载项目根目录下的 ormconfig.json 配置文件用于配置数据库连接
    // TypeORM 配置文件详细文档 https://typeorm.io/#/using-ormconfig
    // 我们可以ormconfig.json在项目根目录中创建一个文件，而不是传递任何内容。
    TypeOrmModule.forRoot(), //  建立 typeorm 与数据库的连接
    UserModule,
  ],
  // 当前模块的提供者集合
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      // 全局拦截器，这里使用全局异常拦截器改写异常消息结构
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      // 全局拦截器，这里使用全局异常拦截器改写异常消息结构
      provide: APP_INTERCEPTOR,
      useClass: UnloginInterceptor,
    },
  ],
})
export class AppModule {
  // 中间件不能在 @Module() 装饰器中列出。我们必须使用模块类的 configure() 方法来设置它们。
  // 包含中间件的模块必须实现 NestModule 接口。我们将 LoggerMiddleware 设置在 ApplicationModule 层上。
  configure(consumer: MiddlewareConsumer) {
    // IMPORTANT! Call Middleware.configure BEFORE using it for route
    ExpressSessionMiddleware.configure({
      name: 'token',
      secret: 'redwar',
      resave: true,
      saveUninitialized: true,
      cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 60000,
      },
      store:  new (ConnectRedis(session))({
        host: '127.0.0.1',
        port: 7379,
        password: '123456',
        db: 2,
        prefix: 'token:',
        ttl: 86400,
      }),
    });

    CookieParserMiddleware.configure('redwar');

    consumer
      .apply(CookieParserMiddleware, ExpressSessionMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
