import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../jwt/jwt.constant';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    if (!token) {
      throw new UnauthorizedException(
        'O token de autenticação é obrigatório e não foi fornecido na solicitação.',
        {
          description:
            'Certifique-se de incluir um token de autenticação válido no cabeçalho da sua solicitação. Faça login para obter um token válido e tente novamente.',
        },
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['usuario'] = payload;
    } catch {
      throw new UnauthorizedException(
        'O token de autenticação fornecido é inválido ou expirou. Por favor, faça login novamente para obter um novo token.',
        {
          description:
            'Certifique-se de incluir o token correto na sua solicitação e verifique se ele não expirou. Se o problema persistir, entre em contato com o suporte.',
        },
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
