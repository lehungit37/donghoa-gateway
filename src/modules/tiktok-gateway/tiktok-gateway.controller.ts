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
import { TiktokGatewayService } from './tiktok-gateway.service';

@Controller('gateway/tiktok')
export class TiktokGatewayController {
  constructor(private readonly tiktokGatewayService: TiktokGatewayService) {}

  @Get('webhook')
  verifyWebhook(
    @Query('verify_token') token: string,
    @Query('challenge') challenge: string,
  ) {
    const result = this.tiktokGatewayService.verifyWebhook(token, challenge);
    if (result) {
      return result;
    }
    throw new ForbiddenException('Invalid TikTok verification token');
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleEvent(@Body() body: any) {
    this.tiktokGatewayService.handleEvent(body);
    return 'EVENT_RECEIVED';
  }
}
