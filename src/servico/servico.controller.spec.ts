import { Test, TestingModule } from '@nestjs/testing';
import { ServicoController } from './servico.controller';
import { ServicoService } from './servico.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { ServicoMotorista } from '@prisma/client';

describe('ServicoController', () => {
  let controller: ServicoController;
  let service: ServicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicoController],
      providers: [ServicoService],
    }).compile();

    controller = module.get<ServicoController>(ServicoController);
    service = module.get<ServicoService>(ServicoService);
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const CreateServicoDto: CreateServicoDto = {
         descricao: 'Teste',
         preco: 10,
         titulo: 'Teste',
        // Add your test data here
      };

      jest.spyOn(service, 'create').mockResolvedValue({});

      const result = await controller.create(createServicoDto);

      expect(result).toEqual({});
      expect(service.create).toHaveBeenCalledWith(createServicoDto);
    });
  });

  describe('findAll', () => {
    it('should return all services', async () => {
      const services: ServicoMotorista[] = [
        // Add your test data here
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(services);

      const result = await controller.findAll();

      expect(result).toEqual(services);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // Add more test cases for other methods in the controller

});