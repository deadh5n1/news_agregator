import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerStorageService } from './throttler-storage.service';

@Injectable()
export class CustomThrottlerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private storage: ThrottlerStorageService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const className = context.getClass();

    const limit = this.reflector.getAllAndOverride<number>('throttle_limit', [
      handler,
      className,
    ]) || 60;

    const ttl = this.reflector.getAllAndOverride<number>('throttle_ttl', [
      handler,
      className,
    ]) || 60000;

    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress;
    const key = `${ip}:${request.path}`;

    const { count, resetTime } = await this.storage.increment(key, ttl);

    if (count > limit) {
      request.res.setHeader('Retry-After', Math.ceil((resetTime - Date.now()) / 1000));
      throw new Error('Too many requests');
    }

    request.res.setHeader('X-RateLimit-Limit', limit);
    request.res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - count));
    request.res.setHeader('X-RateLimit-Reset', resetTime);

    return true;
  }
}
