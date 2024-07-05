import { Injectable } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicoMotorista } from '@prisma/client';

@Injectable()
export class ServicoService {

  constructor(private readonly prisma: PrismaService) {}
  create(createServicoDto: CreateServicoDto, motoristaId: number): Promise<ServicoMotorista> {
    const newService = this.prisma.servicoMotorista.create({
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

  findOne(id: number) {
    return `This action returns a #${id} servico`;
  }

  update(id: number, updateServicoDto: UpdateServicoDto) {
    return `This action updates a #${id} servico`;
  }

  remove(id: number) {
    return `This action removes a #${id} servico`;
  }
}
