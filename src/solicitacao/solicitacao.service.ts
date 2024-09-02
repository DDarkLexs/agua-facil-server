import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { LocalizacaoService } from 'src/localizacao/localizacao.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicoService } from 'src/servico/servico.service';
import { CreatePaymentNoteDto, CreateSolicitacaoByClienteIdDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';

@Injectable()
export class SolicitacaoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly servicoService: ServicoService,
    private readonly localizacaoService: LocalizacaoService,
    private readonly authService: AuthService,
  ) { }
  async create(
    id: number,
    clienteId: number,
    createSolicitacaoDto: CreateSolicitacaoByClienteIdDto,
  ) {
    const service = await this.servicoService.findOne(id);
    if (!service) {
      throw new NotFoundException('Serviço inexistente');
    }
    const motorista = await this.prisma.motorista.findFirst({
      where: {
        id: service.motoristaId
      }
    })
    if (!motorista) {
      throw new NotFoundException('Motorista inexistente');
    }
    if (motorista.disponivel === false) {
      throw new ServiceUnavailableException(
        'Serviço indisponível para solicitação',
      );
    }

    const location = await this.localizacaoService.findLocationByCoordenadaAsync(createSolicitacaoDto.cordenada);

    const newSolicitacao = await this.prisma.servicoSolicitado.create({
      data: {
        litroAgua: service.litroAgua,
        preco: service.preco,
        titulo: service.titulo,
        clienteId,
        motoristaId: service.motoristaId,

        // ...createSolicitacaoDto, // Verifique se `createSolicitacaoDto` está definido corretamente
      },
    });

    if (newSolicitacao) {
      const SSCoordenada = await this.prisma.sSCoordenada.create({
        data: {
          cordenada: createSolicitacaoDto.cordenada,
          servicoSolicitadoId: newSolicitacao.id,
          endereco: location.data.display_name,
        },
      })

      // await this.prisma.servicoMotorista.update({
      //   data: {
      //     ocupado: true,
      //   },
      //   where: {
      //     id: service.motoristaId,
      //   },
      // });
    }
    return this.prisma.servicoSolicitado.findFirst({ where: { id: newSolicitacao.id }, include: { motorista: true, SSCoordenada: true } });
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

  async findOneByMotoristaAvailable(id: number, motoristaId: number) {

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
  async findOneByClienteAvailable(id: number, clienteId: number) {


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


  async findOneByClinte(id: number, clienteId: number) {
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
  async findOneActive(id: number) {
    const query = await this.prisma.servicoSolicitado.findFirst({
      where: {
        id,
      },
    });

    if (!query) {
      throw new NotFoundException('Solicitação inexistente');
    }

    if (query.status !== $Enums.ServicoStatus.ACEITO && query.status !== $Enums.ServicoStatus.PENDENTE) {
      throw new NotFoundException('Solicitação inexistente');
    }
    return query;
  }
  async updateByCliente(clienteId: number, id: number, status: $Enums.ServicoStatus) {
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
      },
      data: {
        status,
        dataConclusao: date
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

    // if (updateSolicitacaoDto.status === $Enums.ServicoStatus.CONCLUIDO || updateSolicitacaoDto.status === $Enums.ServicoStatus.RECUSADO || updateSolicitacaoDto.status === $Enums.ServicoStatus.CANCELADO) {
    //   date = new Date();
    // }


    solicitacaoAtualizada = await this.prisma.servicoSolicitado.update({
      where: {
        id,
        motoristaId,
      },
      include: {
        motorista: true,
        SSCoordenada: true,
      },
      data: {
        ...updateSolicitacaoDto,
        // dataConclusao: date,
      },
    });


    if (
      solicitacaoAtualizada.status === $Enums.ServicoStatus.CONCLUIDO ||
      solicitacaoAtualizada.status === $Enums.ServicoStatus.RECUSADO ||
      solicitacaoAtualizada.status === $Enums.ServicoStatus.CANCELADO
    ) {
      /* aatt */
      await this.atulizarMotoristaDisponibilidade(motoristaId, id, false);


      solicitacaoAtualizada = await this.prisma.servicoSolicitado.update({
        where: {
          id,
          motoristaId,
        },
        include: {
          // motorista: true,
          SSCoordenada: true,
        },
        data: {
          dataConclusao: new Date(),
        },
      });
    }
    return solicitacaoAtualizada;
  }
  async motoristaFinalizaSolicitacao(
    id: number,
    motoristaId: number,
    updateSolicitacaoDto: UpdateSolicitacaoDto,
  ) {

    if (updateSolicitacaoDto.status === $Enums.ServicoStatus.ACEITO || updateSolicitacaoDto.status === $Enums.ServicoStatus.PENDENTE) {
      throw new BadRequestException('Solicitação não concluída');
    }
    const solicitacao = await this.prisma.servicoSolicitado.findFirst({
      where: {
        id,
        motoristaId,
      },
    });
    if (!solicitacao) {
      throw new NotFoundException('Solicitação inexistente');
    }
    const solicitacaoAtualizada = await this.prisma.servicoSolicitado.update({
      where: {
        id,
        motoristaId,
      },
      data: {
        dataConclusao: new Date(),
        ...updateSolicitacaoDto,

      },
    });
    return solicitacaoAtualizada;
  }

  private async atulizarMotoristaDisponibilidade(motoristaId: number, servicoid: number, disponivel: boolean) {

    const service = await this.servicoService.findOne(servicoid);
    if (!service) {
      throw new NotFoundException("Serviço inexistente");
    }
    // const servicoMotorista = await this.prisma.servicoMotorista.update({
    //   data: {
    //     ocupado: disponivel,
    //   },
    //   where: {
    //     motoristaId,
    //     id: servicoid
    //   },
    // });
    const motorista = await this.prisma.motorista.update({
      data: {
        disponivel,
      },
      where: {
        id: motoristaId,
      },
    })
    return {
      motorista,
      // servicoMotorista
    }

  }
  async createPaymentNote(data: CreatePaymentNoteDto, solicitacaoId: number) {
    const solicitacao = await this.findOneActive(solicitacaoId);
    let payment;
    if (data.valor === null) {
      payment = await this.prisma.sSNotaPagamento.create({
        data: { ...data, valor: solicitacao.preco, servicoSolicitadoId: solicitacaoId },
      })
    } else {
      payment = await this.prisma.sSNotaPagamento.create({
        data: { ...data, servicoSolicitadoId: solicitacaoId },
      })
    }
    return payment;
  }
  remove(id: number) {
    return `This action removes a #${id} solicitacao`;
  }
}
