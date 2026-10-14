import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerStorageService {
  private storage = new Map<string, { count: number; resetTime: number }>();

  async increment(key: string, ttl: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now();
    const record = this.storage.get(key);

    if (!record || record.resetTime < now) {
      const resetTime = now + ttl;
      this.storage.set(key, { count: 1, resetTime });
      return { count: 1, resetTime };
    }

    record.count += 1;
    return { count: record.count, resetTime: record.resetTime };
  }

  async decrement(key: string): Promise<void> {
    const record = this.storage.get(key);
    if (record && record.count > 0) {
      record.count -= 1;
    }
  }
}
