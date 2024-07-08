import { Injectable, NotFoundException, ServiceUnavailableException, } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicoService } from 'src/servico/servico.service';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';
import { CreateSolicitacaoByMotoristaIdDto } from './dto/create-solicitacao.dto';

@Injectable()
export class SolicitacaoService {
  constructor(private readonly prisma: PrismaService,
    private readonly servicoService: ServicoService) { }
  async create(id: number,clienteId: number, createSolicitacaoDto: CreateSolicitacaoByMotoristaIdDto) {
    const service = await this.servicoService.findOne(id);
    if (!service) {
      throw new NotFoundException('Serviço inexistente');
    }
    if (service.ocupado === true) {
      throw new ServiceUnavailableException('Serviço indisponível para solicitação');
    }

    const newSolicitacao = await this.prisma.servicoSolicitado.create({
      data: {
        litroAgua: service.litroAgua,
        preco: service.preco,
        titulo: service.titulo,
        clienteId,
        motoristaId: service.motoristaId,
        ...createSolicitacaoDto  // Verifique se `createSolicitacaoDto` está definido corretamente
      }
    });
    
    
    return newSolicitacao;
  }

  findAll() {
    return `This action returns all solicitacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solicitacao`;
  }

  update(id: number, updateSolicitacaoDto: UpdateSolicitacaoDto) {
    return `This action updates a #${id} solicitacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} solicitacao`;
  }
}
