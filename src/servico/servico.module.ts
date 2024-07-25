import { Module } from '@nestjs/common';
import { ServicoService } from './servico.service';
import { ServicoController } from './servico.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicoGateway } from './servico.gateway';
import { AuthService } from 'src/auth/auth.service';
import { HashService } from 'src/hash/hash.service';

@Module({
  controllers: [ServicoController],
  providers: [AuthService, HashService,ServicoService, PrismaService, ServicoGateway],
  // imports: [AuthService],
})
export class ServicoModule {}
