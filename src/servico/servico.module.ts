import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { HashService } from 'src/hash/hash.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SolicitacaoService } from 'src/solicitacao/solicitacao.service';
import { ServicoController } from './servico.controller';
import { ServicoGateway } from './servico.gateway';
import { ServicoService } from './servico.service';
import { LocalizacaoService } from 'src/localizacao/localizacao.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ServicoController],
  providers: [AuthService, HashService, ServicoService, PrismaService, ServicoGateway, SolicitacaoService, LocalizacaoService],
  imports: [HttpModule],
  // imports: [AuthService],
})
export class ServicoModule { }
