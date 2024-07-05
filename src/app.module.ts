import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { ClienteModule } from './cliente/cliente.module';
import { HashService } from './hash/hash.service';
import { MotoristaModule } from './motorista/motorista.module';
import { PedidoModule } from './pedido/pedido.module';
import { PrismaService } from './prisma/prisma.service';
import { ServicoModule } from './servico/servico.module';
import { AuthorizationModule } from './authorization/authorization.module';
@Module({
  imports: [AuthModule, ClienteModule, MotoristaModule, PedidoModule, ServicoModule, AuthorizationModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaService, HashService],
})
export class AppModule { }