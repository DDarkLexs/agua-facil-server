import { SetMetadata } from '@nestjs/common';
import { $Enums } from '@prisma/client';

export const ROLES_KEY = 'authorization';
export const Autorizacao = (...entidades: $Enums.UsuarioTipo[]) =>
    SetMetadata(ROLES_KEY, entidades);