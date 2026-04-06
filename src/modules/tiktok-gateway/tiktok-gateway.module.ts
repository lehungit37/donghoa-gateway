import { Module } from '@nestjs/common';
import { TiktokGatewayController } from './tiktok-gateway.controller';
import { TiktokGatewayService } from './tiktok-gateway.service';

@Module({
  controllers: [TiktokGatewayController],
  providers: [TiktokGatewayService],
})
export class TiktokGatewayModule {}
