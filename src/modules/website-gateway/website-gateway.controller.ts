import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { WebsiteGatewayService } from './website-gateway.service';

@Controller('gateway/website')
export class WebsiteGatewayController {
  constructor(private readonly websiteGatewayService: WebsiteGatewayService) {}

  @Get('webhook')
  verifyWebhook(@Query('verify_token') token: string) {
    const isValid = this.websiteGatewayService.verifyWebhook(token);
    if (isValid) {
      return 'OK';
    }
    throw new ForbiddenException('Invalid Website verification token');
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleEvent(@Body() body: any) {
    this.websiteGatewayService.handleEvent(body);
    return 'EVENT_RECEIVED';
  }
}
