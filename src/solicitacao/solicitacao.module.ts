import { Module } from '@nestjs/common';
import { LocalizacaoService } from 'src/localizacao/localizacao.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicoService } from 'src/servico/servico.service';
import { SolicitacaoController } from './solicitacao.controller';
import { SolicitacaoService } from './solicitacao.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [SolicitacaoController],
  providers: [SolicitacaoService, PrismaService, ServicoService, LocalizacaoService],
  imports: [HttpModule],
})
export class SolicitacaoModule { }
