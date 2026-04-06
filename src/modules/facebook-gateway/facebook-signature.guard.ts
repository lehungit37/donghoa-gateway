import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request } from 'express';

@Injectable()
export class FacebookSignatureGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    
    const signature = req.headers['x-hub-signature-256'] as string;
    if (!signature) {
      throw new UnauthorizedException('Missing X-Hub-Signature-256 header');
    }

    const appSecret = this.configService.get<string>('FACEBOOK_APP_SECRET');
    if (!appSecret) {
      throw new UnauthorizedException('Missing FACEBOOK_APP_SECRET in env');
    }

    const [, hash] = signature.split('=');

    const rawBody = (req as any).rawBody; 
    
    const expectedHash = crypto
      .createHmac('sha256', appSecret)
      .update(rawBody || '')
      .digest('hex');

    if (hash !== expectedHash) {
      throw new UnauthorizedException('Invalid Facebook Signature');
    }

    return true;
  }
}
