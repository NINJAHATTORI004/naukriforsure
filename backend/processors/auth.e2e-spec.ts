import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { v4 as uuidv4 } from 'uuid';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const user = {
    email: `test-${uuidv4()}@example.com`,
    password: 'Password123',
    name: 'Test User',
  };
  let accessToken: string;

  it('/api/v1/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(user)
      .expect(201)
      .then((res) => {
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data).toHaveProperty('refreshToken');
      });
  });

  it('/api/v1/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200)
      .then((res) => {
        expect(res.body.data).toHaveProperty('accessToken');
        accessToken = res.body.data.accessToken;
      });
  });
});