import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicoService } from 'src/servico/servico.service';
import { CreateSolicitacaoByMotoristaIdDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';

@Injectable()
export class SolicitacaoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly servicoService: ServicoService,
  ) {}
  async create(
    id: number,
    clienteId: number,
    createSolicitacaoDto: CreateSolicitacaoByMotoristaIdDto,
  ) {
    const service = await this.servicoService.findOne(id);
    if (!service) {
      throw new NotFoundException('Serviço inexistente');
    }
    if (service.ocupado === true) {
      throw new ServiceUnavailableException(
        'Serviço indisponível para solicitação',
      );
    }

    const newSolicitacao = await this.prisma.servicoSolicitado.create({
      data: {
        litroAgua: service.litroAgua,
        preco: service.preco,
        titulo: service.titulo,
        clienteId,
        motoristaId: service.motoristaId,
        ...createSolicitacaoDto, // Verifique se `createSolicitacaoDto` está definido corretamente
      },
    });

    if (newSolicitacao) {
      this.prisma.servicoMotorista.update({
        data: {
          ocupado: true,
        },
        where: {
          id: service.motoristaId,
        },
      });
    }
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
        clienteId,
      },
    });
    return query;
  }
  async findAllbyhistorico(clienteId: number) {
    const query = await this.prisma.servicoSolicitado.findMany({
      where: {
        clienteId,
        // status: $Enums.ServicoStatus.CONCLUIDO,
        OR: [
          {
            status: $Enums.ServicoStatus.RECUSADO,
          },
          {
            status: $Enums.ServicoStatus.CONCLUIDO,
          },
        ],
      },
      include:{
        motorista: {
          include:{
            usuario: {
              select:{
                email: true,
                nome: true,
                telefone: true,
                tipo: true,
                id:true,
                created: true,
              }
            }
            
          }
        }
      }
    });
    return query;
  }

  async findOne(id: number, clienteId: number) {
    const query = await this.prisma.servicoSolicitado.findFirst({
      where: {
        id,
        clienteId,
      },
    });

    if (!query) {
      throw new NotFoundException('Solicitação inexistente');
    }
    return query;
  }

  async updateByMotorista(
    id: number,
    motoristaId: number,
    updateSolicitacaoDto: UpdateSolicitacaoDto,
  ) {
    const solicitacao = await this.prisma.servicoSolicitado.findFirst({
      where: {
        id,
        motoristaId,
      },
    });
    if (!solicitacao) {
      throw new NotFoundException('Solicitação inexistente');
    }
    let solicitacaoAtualizada;
    
    
    solicitacaoAtualizada = await this.prisma.servicoSolicitado.update({
      where: {
        id,
        motoristaId,
      },
      data: {
        ...updateSolicitacaoDto,
      },
    });

    if (
      solicitacaoAtualizada.status === $Enums.ServicoStatus.CONCLUIDO ||
      solicitacaoAtualizada.status === $Enums.ServicoStatus.RECUSADO
    ) {
      await this.prisma.servicoMotorista.update({
        data: {
          ocupado: false,
        },
        where: {
          motoristaId,
        },
      });

      solicitacaoAtualizada = await this.prisma.servicoSolicitado.update({
        where: {
          id,
          motoristaId,
        },
        data: {
          dataConclusao:new Date(),
        },
      });
    }
    return solicitacaoAtualizada;
  }

  remove(id: number) {
    return `This action removes a #${id} solicitacao`;
  }
}
