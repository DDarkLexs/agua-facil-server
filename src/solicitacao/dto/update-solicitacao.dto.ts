import { PartialType } from '@nestjs/mapped-types';
import { CreateSolicitacaoDto } from './create-solicitacao.dto';
import { IsEnum } from 'class-validator';
import { $Enums } from '@prisma/client';

export class UpdateSolicitacaoDto extends PartialType(CreateSolicitacaoDto) {
  @IsEnum($Enums.ServicoStatus, { message: 'O valor fornecido para o campo "status" é inválido. Por favor, forneça um dos valores válidos: "PENDENTE", "ACEITO", "CONCLUIDO" ou "RECUSADO".' })
  status:  $Enums.ServicoStatus
    
}


export class UpdateStatusSolicitacaoDto {
  @IsEnum($Enums.ServicoStatus, { message: 'O valor fornecido para o campo "status" é inválido. Por favor, forneça um dos valores válidos: "PENDENTE", "ACEITO", "CONCLUIDO" ou "RECUSADO".' })
  status:  $Enums.ServicoStatus
}
