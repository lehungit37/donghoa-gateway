import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FacebookGatewayModule } from './modules/facebook-gateway/facebook-gateway.module';
import { TiktokGatewayModule } from './modules/tiktok-gateway/tiktok-gateway.module';
import { WebsiteGatewayModule } from './modules/website-gateway/website-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    FacebookGatewayModule,
    TiktokGatewayModule,
    WebsiteGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

