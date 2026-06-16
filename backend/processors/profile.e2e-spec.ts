import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { v4 as uuidv4 } from 'uuid';

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const user = {
      email: `profile-test-${uuidv4()}@example.com`,
      password: 'Password123',
      name: 'Profile User',
    };

    await request(app.getHttpServer()).post('/api/v1/auth/register').send(user);

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password });

    accessToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/profiles (POST) - should create a profile', () => {
    return request(app.getHttpServer())
      .post('/api/v1/profiles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        firstName: 'Test',
        lastName: 'User',
        headline: 'Software Engineer',
      })
      .expect(201)
      .then((res) => {
        expect(res.body.data).toHaveProperty('id');
      });
  });

  it('/api/v1/profiles/me (GET) - should get the created profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/profiles/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.firstName).toBe('Test');
    expect(res.body.data.headline).toBe('Software Engineer');
  });
});