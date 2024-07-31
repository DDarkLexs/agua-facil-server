import { Module } from '@nestjs/common';
import { LocalizacaoService } from 'src/localizacao/localizacao.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicoService } from 'src/servico/servico.service';
import { SolicitacaoController } from './solicitacao.controller';
import { SolicitacaoService } from './solicitacao.service';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from 'src/auth/auth.service';
import { HashService } from 'src/hash/hash.service';

@Module({
  controllers: [SolicitacaoController],
  providers: [SolicitacaoService, PrismaService, ServicoService, LocalizacaoService, AuthService, HashService],
  imports: [HttpModule],
})
export class SolicitacaoModule { }
