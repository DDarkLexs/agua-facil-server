import { ServicoSolicitado, SSCoordenada, SSNotaPagamento } from '@prisma/client';

import { IsLatLong, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSolicitacaoDto
  implements
  Omit<
    ServicoSolicitado,
    'clienteId' | 'created' | 'id' | 'updated' | 'status'
  > {
  @IsNotEmpty({ message: 'A coordenada é obrigatória' })
  coordenada: string;
  @IsOptional()
  @IsString({ message: 'Por favor, Informe o endereço' })
  endereco: string;
  @IsOptional()
  dataConclusao: Date;
  @IsNotEmpty({ message: 'O id do motorista é obrigatório' })
  motoristaId: number;
  @IsNotEmpty({ message: 'O preço é obrigatório' })
  preco: number;
  @IsNotEmpty({ message: 'O litro de água é obrigatório' })
  litroAgua: number;
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString({ message: 'O título precisa ser uma string' })
  titulo: string;
  @IsOptional()
  descricao: string | null;
  @IsOptional()
  sSNotaPagamentoId: number;
}

export class CreateSolicitacaoByClienteIdDto
  implements Pick<SSCoordenada, 'cordenada' | 'endereco'> {
  @IsNotEmpty({ message: 'A coordenada é obrigatória' })
  @IsLatLong({ message: 'Coordenada inválida' })
  cordenada: string;
  @IsOptional()
  @IsString({ message: 'Por favor, Informe o endereço' })
  endereco: string;
}
export class CreatePaymentNoteDto implements Pick<SSNotaPagamento, "formaDePagamento" | "valor"> {
  @IsNotEmpty({ message: 'O valor não pode estar vazio' })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  valor: number;

  @IsNotEmpty({ message: 'A forma de pagamento não pode estar vazia' })
  @IsString({ message: 'A forma de pagamento deve ser uma string' })
  formaDePagamento: string;
}