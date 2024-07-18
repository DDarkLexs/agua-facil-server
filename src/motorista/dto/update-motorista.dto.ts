import { IsLatLong, IsNotEmpty } from 'class-validator';
import { CreateMotoristaDto } from './create-motorista.dto';

export class UpdateMotoristaDto extends CreateMotoristaDto { }


export class UpdateMotoristaCoordenadaDto {
    @IsLatLong({ message: 'Coordenada inválida' })
    @IsNotEmpty({ message: 'Informe a coordenada para o motorista.' })
    coordenada: string
}

