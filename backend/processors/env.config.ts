import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

export const envConfig: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3001),
    DATABASE_URL: Joi.string().required(),
    REDIS_URL: Joi.string().required(),
    OPENSEARCH_NODE: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION: Joi.string().default('15m'),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
    AWS_REGION: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_S3_BUCKET: Joi.string().required(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  envFilePath: ['.env'],
};