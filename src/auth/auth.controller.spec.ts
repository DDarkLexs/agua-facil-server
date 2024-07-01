import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/driver/login Motrista (POST) - successful login', () => {
    return request(app.getHttpServer())
      .post('/auth/driver/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ telefone: 'senhaSegura123', senha: '912345678' })
      .expect(200)
      .expect((res) => {
        // Add your assertions here
      });
  });

  it('/auth/driver/login Motorista (POST) - unsuccessful login', () => {
    return request(app.getHttpServer())
      .post('/auth/driver/login')
      .set('Content-Type', 'application/json')
      .send({ telefone: 'test', senha: 'wrong' })
      .expect(401)
      .expect((res) => {
        // Add your assertions here
      });
  });

  // Add more test cases for other endpoints in the auth module

  afterAll(async () => {
    await app.close();
  });
});


