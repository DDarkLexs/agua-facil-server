import { ServicoMotorista } from '@prisma/client';
import { IsLatLong, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class CreateServicoDto implements Omit<ServicoMotorista, 'id' | 'createdAt' | 'updatedAt' | "ocupado" | "motoristaId" | "clienteId"> {
    @IsNotEmpty({ message: 'O título não pode estar vazio' })
    titulo: string;
    @IsNotEmpty({ message: 'A descrição não pode estar vazio' })
    @IsString({ message: 'A descrição deve ser uma string' })
    descricao: string;
    @IsNotEmpty({ message: 'O preco não pode estar vazio' })
    @IsNumber({}, { message: 'O preço deve ser um número' })
    preco: number;
    @IsOptional({ message: 'A coordenada deve ser uma string' })
    @IsLatLong({ message: 'A coordenada deve ser neste formato: (lat, long)' })
    coordenada: string;
    @IsOptional({ message: 'O endereço deve ser uma string' })
    endereco: string;
    @IsNotEmpty({ message: 'O litro não pode estar vazio' })
    @IsNumber({}, { message: 'O litro deve ser um número' })
    litroAgua: number;
}
