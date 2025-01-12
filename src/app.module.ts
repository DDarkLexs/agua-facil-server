import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthorizationModule } from './authorization/authorization.module';
import { ClienteModule } from './cliente/cliente.module';
import { HashService } from './hash/hash.service';
import { MotoristaModule } from './motorista/motorista.module';
import { PrismaService } from './prisma/prisma.service';
import { ServicoModule } from './servico/servico.module';
import { SolicitacaoModule } from './solicitacao/solicitacao.module';
import { LocalizacaoService } from './localizacao/localizacao.service';
import { LocalizacaoModule } from './localizacao/localizacao.module';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [AuthModule, ClienteModule, MotoristaModule, ServicoModule, AuthorizationModule, SolicitacaoModule, LocalizacaoModule, HttpModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaService, HashService, LocalizacaoService],
})
export class AppModule { }