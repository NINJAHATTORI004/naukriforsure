import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';

@Module({
  providers: [
    {
      provide: 'OPENSEARCH_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Client({
          node: configService.getOrThrow<string>('OPENSEARCH_NODE'),
          ssl: {
            rejectUnauthorized: process.env.NODE_ENV === 'production',
          },
        });
      },
    },
  ],
  exports: ['OPENSEARCH_CLIENT'],
})
export class OpenSearchModule {}