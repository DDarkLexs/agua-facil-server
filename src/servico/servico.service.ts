import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { ServicoMotorista } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';

@Injectable()
export class ServicoService {

  constructor(private readonly prisma: PrismaService) { }
  async create(createServicoDto: CreateServicoDto, motoristaId: number): Promise<ServicoMotorista> {
    const newService = await this.prisma.servicoMotorista.create({
      data: {
        ...createServicoDto,
        motoristaId,
      }
    })
    return newService;
  }

  findAll() {
    return `This action returns all servico`;
  }

  async findAllByMotorista(id: number) {
    if (!id) {
      throw new NotAcceptableException('Id não informado!');
    }
    const response = await this.prisma.servicoMotorista.findMany({
      where: {
        motoristaId: id
      }
    })
    return response;
  }

  async findOne(id: number) {
    if (!id) {
      throw new NotAcceptableException('Id não informado!');
    }
    const response = await this.prisma.servicoMotorista.findFirst({
      where: {
        id,
      }
    })
    return response;
  }

  async update(id: number, updateServicoDto: UpdateServicoDto) {
    if (!id) {
      throw new ForbiddenException('Id não informado!');

    }
    const query = await this.findOne(id);
    if (!query) {
      throw new NotFoundException('Serviço não encontrado!');

    }
    const response = this.prisma.servicoMotorista.update({
      where: {
        id,
      },
      data: {
        ...updateServicoDto
      }
    })
    return response;
  }

  async remove(id: number) {
    if (!id) {
      throw new ForbiddenException('Id não informado!');

    }
    const query = await this.findOne(id);
    if (!query) {
      throw new NotFoundException('Serviço não encontrado!');

    }
    const response = this.prisma.servicoMotorista.delete({
      where: {
        id,
      }
    })
    return `Serviço removido com sucesso!`;
  }
}
