import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CryptoUtil } from '../common/utils/crypto.util';
import { User } from './user.entity';

// 可注入的，修饰符
@Injectable()
export class UserService {

  constructor(
    // 传入数据实体，生成数据仓库 的 依赖注入
    // 这里主要 User 不是一个 provide，需要内部转换成 Repository<User> 才能变成 provide, 所以要使用 InjectRepository
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    // 一般 的 依赖注入
    @Inject(CryptoUtil) private readonly cryptoUtil: CryptoUtil,
  ) {}

  /**
   * 用户登录
   *
   * @param account 登录账号
   * @param password 登录密码
   */
  async login(account: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({ account });
    if (!user) {
      throw new HttpException('登录账号有误', 406);
    }
    if (!this.cryptoUtil.checkPassword(password, user.password)) {
      throw new HttpException('登录密码有误', 406);
    }

    return user;
  }
}
