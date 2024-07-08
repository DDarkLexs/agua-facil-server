import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
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

    // console.log(req.usuario);
    if (!required) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const usuario: any = req['usuario'];

    if (usuario.tipo === required[0]) {
      return true;
    } else {
      throw new ForbiddenException(`Sem permissão para acessar este recurso!`);
    }
  }
}