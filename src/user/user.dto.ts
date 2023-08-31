export class UserDto {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  isActive?: boolean;
  createdAt?: Date;
  roles: string[];
  socialLogin?: string;
}
