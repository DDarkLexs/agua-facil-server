import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { $Enums, ServicoMotorista } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';

@Injectable()
export class ServicoService {
  constructor(private readonly prisma: PrismaService) {}

  /* 
  
 ███▄ ▄███▓ ▒█████  ▄▄▄█████▓ ▒█████   ██▀███   ██▓  ██████ ▄▄▄█████▓ ▄▄▄      
▓██▒▀█▀ ██▒▒██▒  ██▒▓  ██▒ ▓▒▒██▒  ██▒▓██ ▒ ██▒▓██▒▒██    ▒ ▓  ██▒ ▓▒▒████▄    
▓██    ▓██░▒██░  ██▒▒ ▓██░ ▒░▒██░  ██▒▓██ ░▄█ ▒▒██▒░ ▓██▄   ▒ ▓██░ ▒░▒██  ▀█▄  
▒██    ▒██ ▒██   ██░░ ▓██▓ ░ ▒██   ██░▒██▀▀█▄  ░██░  ▒   ██▒░ ▓██▓ ░ ░██▄▄▄▄██ 
▒██▒   ░██▒░ ████▓▒░  ▒██▒ ░ ░ ████▓▒░░██▓ ▒██▒░██░▒██████▒▒  ▒██▒ ░  ▓█   ▓██▒
░ ▒░   ░  ░░ ▒░▒░▒░   ▒ ░░   ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░░▓  ▒ ▒▓▒ ▒ ░  ▒ ░░    ▒▒   ▓▒█░
░  ░      ░  ░ ▒ ▒░     ░      ░ ▒ ▒░   ░▒ ░ ▒░ ▒ ░░ ░▒  ░ ░    ░      ▒   ▒▒ ░
░      ░   ░ ░ ░ ▒    ░      ░ ░ ░ ▒    ░░   ░  ▒ ░░  ░  ░    ░        ░   ▒   
       ░       ░ ░               ░ ░     ░      ░        ░                 ░  ░
                                                                               

  
  */
  async create(
    motoristaId: number,
    createServicoDto: CreateServicoDto,
  ): Promise<ServicoMotorista> {
    if (!motoristaId) {
      throw new ForbiddenException('Motorista não informado!');
    }
    const exist = await this.findAllByMotorista(motoristaId);
    if (exist.length > 0) {
      throw new NotAcceptableException('Motorista ja possui um serviço');
    }

    const newService = await this.prisma.servicoMotorista.create({
      data: {
        ...createServicoDto,
        motoristaId,
      },
    });
    return newService;
  }
  async findAllByMotorista(id: number) {
    if (!id) {
      throw new NotAcceptableException('Id não informado!');
    }
    const response = await this.prisma.servicoMotorista.findMany({
      where: {
        motoristaId: id,
      },
    });
    return response;
  }

  async findOneWithMotorista(motoristaId: number, id: number) {
    if (!id) {
      throw new NotAcceptableException('Id não informado!');
    }
    const response = await this.prisma.servicoMotorista.findFirst({
      where: {
        id,
        motoristaId,
      },
    });
    return response;
  }
  async findOne(id: number) {
    if (!id) {
      throw new NotAcceptableException('Id não informado!');
    }
    const response = await this.prisma.servicoMotorista.findFirst({
      where: {
        id,
      },
    });
    return response;
  }

  async update(
    motoristaId: number,
    id: number,
    updateServicoDto: UpdateServicoDto,
  ) {
    if (!id) {
      throw new ForbiddenException('Id não informado!');
    }
    const query = await this.findOneWithMotorista(motoristaId, id);
    if (!query) {
      throw new NotFoundException('Serviço não encontrado!');
    }
    const response = this.prisma.servicoMotorista.update({
      where: {
        id,
        motoristaId,
      },
      data: {
        ...updateServicoDto,
      },
    });
    return response;
  }

  async remove(motoristaId: number, id: number) {
    if (!id) {
      throw new ForbiddenException('Id não informado!');
    }
    const query = await this.findOneWithMotorista(motoristaId, id);
    if (!query) {
      throw new NotFoundException('Serviço não encontrado!');
    }
    const response = await this.prisma.servicoMotorista.delete({
      where: {
        id,
      },
    });
    return {
      ...response,
      msg: `Serviço removido com sucesso!`,
    };
  }
  /* 
        
      ▄████▄   ██▓     ██▓▓█████  ███▄    █ ▄▄▄█████▓▓█████ 
      ▒██▀ ▀█  ▓██▒    ▓██▒▓█   ▀  ██ ▀█   █ ▓  ██▒ ▓▒▓█   ▀ 
      ▒▓█    ▄ ▒██░    ▒██▒▒███   ▓██  ▀█ ██▒▒ ▓██░ ▒░▒███   
      ▒▓▓▄ ▄██▒▒██░    ░██░▒▓█  ▄ ▓██▒  ▐▌██▒░ ▓██▓ ░ ▒▓█  ▄ 
      ▒ ▓███▀ ░░██████▒░██░░▒████▒▒██░   ▓██░  ▒██▒ ░ ░▒████▒
      ░ ░▒ ▒  ░░ ▒░▓  ░░▓  ░░ ▒░ ░░ ▒░   ▒ ▒   ▒ ░░   ░░ ▒░ ░
        ░  ▒   ░ ░ ▒  ░ ▒ ░ ░ ░  ░░ ░░   ░ ▒░    ░     ░ ░  ░
      ░          ░ ░    ▒ ░   ░      ░   ░ ░   ░         ░   
      ░ ░          ░  ░ ░     ░  ░         ░             ░  ░
      ░                                                        
  */
  async findAllForClienteDisponivel() {
    const query = await this.prisma.servicoMotorista.findMany({
      where: {
        ocupado: false,
      },
      include: {
        motorista: {
          include: {
            usuario: true,
          },
        },
      },
    });
    return query;
  }

}
