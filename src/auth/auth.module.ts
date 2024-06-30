import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { HashService } from 'src/hash/hash.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    HashService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE.toString() || '2h' },
    }),
  ],
})
export class AuthModule {}
