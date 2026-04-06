import { Module } from '@nestjs/common';
import { WebsiteGatewayController } from './website-gateway.controller';
import { WebsiteGatewayService } from './website-gateway.service';

@Module({
  controllers: [WebsiteGatewayController],
  providers: [WebsiteGatewayService],
})
export class WebsiteGatewayModule {}
