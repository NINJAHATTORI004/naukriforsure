import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env.config';
import { LoggerModule } from './logger/logger.module';

@Global()
@Module({
  imports: [ConfigModule.forRoot(envConfig), LoggerModule],
  exports: [ConfigModule, LoggerModule],
})
export class SharedModule {}