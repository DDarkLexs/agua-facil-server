import { SetMetadata } from '@nestjs/common';
import { $Enums } from '@prisma/client';

export const ROLES_KEY = 'authorization';
export const Roles = (...roles: $Enums.UsuarioTipo[]) => SetMetadata($Enums.UsuarioTipo, roles);