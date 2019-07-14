import { SetMetadata } from '@nestjs/common';

// 自定义的装饰器
// 往被装饰的函数对象上，塞属性
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
