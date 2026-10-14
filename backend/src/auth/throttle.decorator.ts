import { SetMetadata } from '@nestjs/common';

export const THROTTLE_LIMIT_KEY = 'throttle_limit';
export const THROTTLE_TTL_KEY = 'throttle_ttl';

export const Throttle = (limit: number, ttl: number) => {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    SetMetadata(THROTTLE_LIMIT_KEY, limit)(target, key!, descriptor!);
    SetMetadata(THROTTLE_TTL_KEY, ttl)(target, key!, descriptor!);
  };
};
