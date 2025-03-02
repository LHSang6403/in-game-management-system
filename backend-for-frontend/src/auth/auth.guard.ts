import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private http: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // return true;

    const ctx = context.getArgByIndex(2);
    const req = ctx.req;

    const token = req.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const response = await this.http.axiosRef.post(
        process.env.AUTH_SERVICE_VERIFY_URL || '',
        {
          token,
        },
      );

      const user = response.data.user;
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      req.user = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Token invalid or Auth service error');
    }
  }
}
