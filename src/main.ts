import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  // 创建应用程序实例，此时所有被 AppModule 导入的其他模块的所有实例都会被加载
  const app = await NestFactory.create(AppModule);
  app.listen(7001).then(() => {
    new Logger('Server').log('Server API server has been started on http://localhost:7001');
  });
}

bootstrap();
