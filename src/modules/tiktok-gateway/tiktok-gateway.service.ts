import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TiktokGatewayService {
  private readonly logger = new Logger(TiktokGatewayService.name);

  constructor(private configService: ConfigService) {}

  verifyWebhook(token: string, challenge: string): string | null {
    const verifyToken = this.configService.get<string>('TIKTOK_VERIFY_TOKEN');
    if (token === verifyToken) {
      this.logger.log('TIKTOK_WEBHOOK_VERIFIED');
      return challenge;
    }
    this.logger.warn('Failed to verify TikTok webhook');
    return null;
  }

  handleEvent(body: any): void {
    this.logger.log(`Received TikTok event: ${JSON.stringify(body)}`);
  }
}
