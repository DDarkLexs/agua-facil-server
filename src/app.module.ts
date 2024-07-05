import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { HashService } from './hash/hash.service';
import { ServiceModule } from './service/service.module';
import { PedidoModule } from './pedido/pedido.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ClienteModule } from './cliente/cliente.module';
import { MotoristaModule } from './motorista/motorista.module';
import { MotoristaModule } from './motorista/motorista.module';
@Module({
  imports: [AuthModule, ServiceModule, PedidoModule, AuthorizationModule, ClienteModule, MotoristaModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaService, HashService],
})
export class AppModule {}