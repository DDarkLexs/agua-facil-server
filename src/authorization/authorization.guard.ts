import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { $Enums } from '@prisma/client';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './authorization.decorator';

@Injectable()
export class AutorizacaoGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const required = this.reflector.getAllAndOverride<$Enums.UsuarioTipo[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) {
      return true;
    }

    // throw new ForbiddenException('Sem permissão de administrador!');
    const req = context.switchToHttp().getRequest();
    // const usuario: AuthGranted['usuario'] = req['usuario'];

    // if (usuario.cargo === requiredCargo[0]) {
    //   return true;
    // } else {
    //   throw new ForbiddenException('Sem permissão de administrador!');
    // }
    return
    // return requiredRoles.some((role) => user.roles?.includes(role));
  }
}