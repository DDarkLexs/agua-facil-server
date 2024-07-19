import { Test, TestingModule } from '@nestjs/testing';
import { ServicoGateway } from './servico.gateway';

describe('ServicoGateway', () => {
  let gateway: ServicoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicoGateway],
    }).compile();

    gateway = module.get<ServicoGateway>(ServicoGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
