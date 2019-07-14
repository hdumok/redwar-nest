import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    // 使用forFeature()方法来定义应在当前范围中注册的存储库。
    TypeOrmModule.forFeature([ User ]),
    CommonModule, // 相当于也导入了 CommondModule 的 providers: [CryptoUtil], 到自己的 Controller
  ],
  providers: [ UserService ], // 自己用到自己service
  controllers: [ UserController ],
  exports: [ UserService ], // 自己的service导给外部模块
})
export class UserModule {}
