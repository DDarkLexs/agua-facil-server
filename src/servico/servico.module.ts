import { Module } from '@nestjs/common';
import { ServicoService } from './servico.service';
import { ServicoController } from './servico.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicoGateway } from './servico.gateway';

@Module({
  controllers: [ServicoController],
  providers: [ServicoService, PrismaService, ServicoGateway],
  
})
export class ServicoModule {}
