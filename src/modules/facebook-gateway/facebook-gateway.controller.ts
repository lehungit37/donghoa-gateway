import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FacebookGatewayService } from './facebook-gateway.service';
import { FacebookSignatureGuard } from './facebook-signature.guard';

@Controller('gateway/facebook')
export class FacebookGatewayController {
  constructor(private readonly facebookGatewayService: FacebookGatewayService) {}

  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const result = this.facebookGatewayService.verifyWebhook(
      mode,
      token,
      challenge,
    );
    if (result) {
      return result;
    }
    throw new ForbiddenException('Invalid Facebook verification token');
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FacebookSignatureGuard)
  handleEvent(@Body() body: any) {
    this.facebookGatewayService.handleEvent(body);

    if (body.object === 'page') {
      return 'EVENT_RECEIVED';
    } else {
      throw new NotFoundException();
    }
  }
}
