import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebsiteGatewayService {
  private readonly logger = new Logger(WebsiteGatewayService.name);

  constructor(private configService: ConfigService) {}

  verifyWebhook(token: string): boolean {
    const verifyToken = this.configService.get<string>('WEBSITE_VERIFY_TOKEN');
    if (token === verifyToken) {
      this.logger.log('WEBSITE_WEBHOOK_VERIFIED');
      return true;
    }
    this.logger.warn('Failed to verify Website webhook');
    return false;
  }

  handleEvent(body: any): void {
    this.logger.log(`Received Website event: ${JSON.stringify(body)}`);
  }
}
