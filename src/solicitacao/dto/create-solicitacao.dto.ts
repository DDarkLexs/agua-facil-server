import { ServicoSolicitado, SSCoordenada } from "@prisma/client";

import { IsLatLong, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSolicitacaoDto implements Omit<ServicoSolicitado, "clienteId" | "created" | "id" | "updated" | "status"> {
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
    descricao: string | null
}



export class CreateSolicitacaoByClienteIdDto implements Pick<SSCoordenada, "cordenada" | "endereco"> {
    @IsNotEmpty({ message: 'A coordenada é obrigatória' })
    @IsLatLong({ message: 'Coordenada inválida' })
    cordenada: string;
    @IsOptional()
    @IsString({ message: 'Por favor, Informe o endereço' })
    endereco: string;
}



