import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { FacebookGatewayController } from './facebook-gateway.controller';
import { FacebookGatewayService } from './facebook-gateway.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FacebookGatewayController],
  providers: [FacebookGatewayService],
})
export class FacebookGatewayModule {}
