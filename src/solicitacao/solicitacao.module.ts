import { Module } from '@nestjs/common';
import { SolicitacaoService } from './solicitacao.service';
import { SolicitacaoController } from './solicitacao.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicoService } from 'src/servico/servico.service';

@Module({
  controllers: [SolicitacaoController],
  providers: [SolicitacaoService,PrismaService, ServicoService],
})
export class SolicitacaoModule {}
