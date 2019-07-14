import { Body, Controller, Get, Inject, Post, Session, UsePipes, ValidationPipe } from '@nestjs/common';

import { Result } from '../common/interfaces/result.interface';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';

@Controller('/manage/user')
export class UserController {
  constructor(
    /**
     * 构造函数，用于注入这个类的依赖，注入类时，需要使用 @Inject() 修饰符，其参数是被注入的类的类名
     *
     * 在注入被 @Injectable() 修饰的类时，可以不使用 @Inject() 修饰参数，此时依赖注器入会使用参数的类型完成注入
     *
     * Tips: 这里我使用 @Inject(AppService) 是为了规范代码风格
     */
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  @Get('')
  async info(@Session() session): Promise<Result> {
    return { code: 200, message: '查询用户成功', data: session.user };
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() body: LoginDto, @Session() session): Promise<Result> {
    const user = await this.userService.login(body.account, body.password);

    session.user = user;

    return { code: 200, message: '登录成功', data: session.user };
  }
}
