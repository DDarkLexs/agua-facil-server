import { Injectable } from '@nestjs/common';
import { CreateMotoristaDto } from './dto/create-motorista.dto';
import { UpdateMotoristaCoordenadaDto, UpdateMotoristaDto } from './dto/update-motorista.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MotoristaService {
  constructor(private readonly prismaService: PrismaService) {}
  async updateCoordenada({coordenada}: UpdateMotoristaCoordenadaDto, id: number) {
    
    return await this.prismaService.motorista.update({
      data:{
        coordenada,
      },
      where:{
        id
      }
    });
  }

  findAll() {
    return `This action returns all motorista`;
  }

  findOne(id: number) {
    return `This action returns a #${id} motorista`;
  }

  update(id: number, updateMotoristaDto: UpdateMotoristaDto) {
    return `This action updates a #${id} motorista`;
  }

  remove(id: number) {
    return `This action removes a #${id} motorista`;
  }
}
