import {
  ForbiddenException,
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
  ) { }
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
      include: {
        motorista: {
          include: {
            usuario: {
              select: {
                email: true,
                nome: true,
                telefone: true,
                tipo: true,
                id: true,
                created: true,
              }
            }

          }
        }
      }
    });
    return query;
  }

  async findOneByMotorista(id: number, motoristaId: number) {
    if (!id) {
      throw new ForbiddenException('Id não informado!');
    }
    const response = await this.prisma.servicoSolicitado.findFirst({
      where: {
        id,
        motoristaId,
        OR: [
          {
            status: $Enums.ServicoStatus.ACEITO,
          },
          {
            status: $Enums.ServicoStatus.PENDENTE,
          },
        ]
      },
    });
    return response;
  }
  async findOneByCliente(id: number, clienteId: number) {


    if (!id) {
      throw new ForbiddenException('Id não informado!');
    }
    const response = await this.prisma.servicoSolicitado.findFirst({
      where: {
        id,
        clienteId,
        OR: [
          {
            status: $Enums.ServicoStatus.ACEITO,
          },
          {
            status: $Enums.ServicoStatus.PENDENTE,
          },
        ]
      },
    });
    return response;
  }
  async findOneEmCursoCliente(id: number) {
    if (!id) {
      throw new ForbiddenException('Id não informado!');
    }
    const response = await this.prisma.servicoSolicitado.findFirst({
      where: {
        clienteId: id,
        OR: [
          {
            status: $Enums.ServicoStatus.ACEITO,
          },
          {
            status: $Enums.ServicoStatus.PENDENTE,
          },
        ]
      },
    });
    return response;
  }

  async findOneEmCursoMotorista(id: number) {
    if (!id) {
      throw new ForbiddenException('Id não informado!');
    }
    const response = await this.prisma.servicoSolicitado.findFirst({
      where: {
        motoristaId: id,
        OR: [
          {
            status: $Enums.ServicoStatus.ACEITO,
          },
          {
            status: $Enums.ServicoStatus.PENDENTE,
          },
        ]
      },
    });
    return response;
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
  async updateByCliente(clienteId:number, id: number, status: $Enums.ServicoStatus) {
    let date = undefined;
    const solicitacao = await this.prisma.servicoSolicitado.findFirst({
      where: {
        id,
        clienteId,
      },
    });

    if (!solicitacao) {
      throw new NotFoundException('Solicitação inexistente');
    }

    if (status === $Enums.ServicoStatus.CONCLUIDO || status === $Enums.ServicoStatus.RECUSADO || status === $Enums.ServicoStatus.CANCELADO) {
      date = new Date();
    }

    const updatedServico = await this.prisma.servicoSolicitado.update({
      where: {
        id,
        clienteId,
        dataConclusao: date
      },
      data: {
        status,
      },
    });
    
    return updatedServico;
    
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
    let date = undefined;

    if (updateSolicitacaoDto.status === $Enums.ServicoStatus.CONCLUIDO || updateSolicitacaoDto.status === $Enums.ServicoStatus.RECUSADO || updateSolicitacaoDto.status === $Enums.ServicoStatus.CANCELADO) {
      date = new Date();
    }


    solicitacaoAtualizada = await this.prisma.servicoSolicitado.update({
      where: {
        id,
        motoristaId,
      },
      data: {
        ...updateSolicitacaoDto,
        dataConclusao: date,
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
          dataConclusao: new Date(),
        },
      });
    }
    return solicitacaoAtualizada;
  }

  remove(id: number) {
    return `This action removes a #${id} solicitacao`;
  }
}
