import { UserRole } from '../../entities/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
} 