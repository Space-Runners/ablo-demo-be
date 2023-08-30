import { Role } from '../src/user/role.entity';

export interface ICreateUserOptions {
  email?: string;
  password?: string;
  role?: Role;
}
