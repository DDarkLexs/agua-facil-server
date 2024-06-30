import { $Enums, Motorista, Usuario } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class AuthUsuarioDto implements Pick<Usuario, 'senha' | 'telefone'> {
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @IsNotEmpty({ message: 'Por favor, informe a sua senha.' })
  senha: string;
  @IsPhoneNumber('AO', {
    message: 'Por favor, informe o número de telefone correto.',
  })
  @IsNotEmpty({ message: 'Por favor,Informe o número de telefone.' })
  telefone: string;
}

export class CreateUsuarioDto
  implements Omit<Usuario, 'created' | 'updated' | 'id'>
{
  @IsNotEmpty({ message: 'Por favor, informe o seu nome.' })
  nome: string;

  @IsEmail({}, { message: 'Por favor, informe um email válido.' })
  email: string;

  @IsEnum($Enums.UsuarioTipo, {
    message:
      'Por favor, selecione um tipo de usuário válido (CLIENTE ou MOTORISTA).',
  })
  tipo: $Enums.UsuarioTipo;

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @IsNotEmpty({ message: 'Por favor, informe a sua senha.' })
  senha: string;

  @IsPhoneNumber('AO', {
    message: 'Por favor, informe um número de telefone correto.',
  })
  telefone: string;
}

export class CreateMotoristaDto
  implements Omit<Motorista, 'created' | 'updated' | 'id'>
{
  @IsNumber()
  @Min(0)
  @Max(5)
  avaliacaoMedia: number;

  @IsUrl(
    {},
    { message: 'Por favor, informe uma URL válida para a foto de perfil.' },
  )
  fotoPerfil: string;

  @IsString()
  @IsNotEmpty({ message: 'Por favor, informe a localização atual.' })
  localizacao: string;

  @IsNotEmpty({ message: 'Por favor, informe o ID do usuário.' })
  usuarioId: number;
}

export class CreateUserDriverDto {
  @IsNotEmpty()
  usuario: CreateUsuarioDto;
  @IsNotEmpty()
  motorista: CreateMotoristaDto;
}
