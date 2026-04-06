import { Module } from '@nestjs/common';
import { FacebookGatewayController } from './facebook-gateway.controller';
import { FacebookGatewayService } from './facebook-gateway.service';

@Module({
  controllers: [FacebookGatewayController],
  providers: [FacebookGatewayService],
})
export class FacebookGatewayModule {}
