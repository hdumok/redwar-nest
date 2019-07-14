import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  readonly account: string;
  @IsString()
  readonly password: string;
}
