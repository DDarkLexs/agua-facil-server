import { Injectable, NotFoundException, ServiceUnavailableException, } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicoService } from 'src/servico/servico.service';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';
import { CreateSolicitacaoByMotoristaIdDto } from './dto/create-solicitacao.dto';
import { $Enums } from '@prisma/client';

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

  /**
   * A description of the entire function.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  async findAll(clienteId: number) {
    const query = await this.prisma.servicoSolicitado.findMany({
      where: {
        clienteId
      }
    })
    return query;
  }
  async findAllbyhistorico(clienteId: number) {
    const query = await this.prisma.servicoSolicitado.findMany({
      where: {
        clienteId,
        status: $Enums.ServicoStatus.CONCLUIDO,
        OR: [
          {
            status: $Enums.ServicoStatus.ACEITO
          },
        ]
      }
    })
    return query;
  }

  async findOne(id: number, clienteId: number) {
    const query = await this.prisma.servicoSolicitado.findFirst({
      where: {
        id,
        clienteId
      }
    })

    if (!query) {
      throw new NotFoundException('Solicitação inexistente');
    }
    return query;
  }

  update(id: number, updateSolicitacaoDto: UpdateSolicitacaoDto) {
    return `This action updates a #${id} solicitacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} solicitacao`;
  }
}
