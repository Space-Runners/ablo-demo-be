import { User } from '../../user/user.entity';

export class LoginResponseDto {
  access_token: string;
  user: User;
}
