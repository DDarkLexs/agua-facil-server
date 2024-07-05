import { Injectable } from '@nestjs/common';
import { CreateMotoristaDto } from './dto/create-motorista.dto';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';

@Injectable()
export class MotoristaService {
  create(createMotoristaDto: CreateMotoristaDto) {
    return 'This action adds a new motorista';
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
