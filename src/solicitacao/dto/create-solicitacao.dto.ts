import { ServicoSolicitado } from "@prisma/client";

import { IsNotEmpty, IsNumber, IsOptional, IsString,IsLatLong } from 'class-validator';

export class CreateSolicitacaoDto implements Omit<ServicoSolicitado, "clienteId" | "created" | "id" | "updated" | "status"> {
    @IsNotEmpty({ message: 'A coordenada é obrigatória' })
    coordenada: string;
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
    descricao: string | null
}
export class CreateSolicitacaoByMotoristaIdDto {
    @IsNotEmpty({ message: 'A coordenada é obrigatória' })
    @IsLatLong({ message: 'Coordenada inválida' })
    coordenada: string;
}
