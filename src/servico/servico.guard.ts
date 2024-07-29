// src/guards/ws-user.guard.ts
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { ServicoService } from './servico.service';
import { SolicitacaoService } from 'src/solicitacao/solicitacao.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class WsUserGuard implements CanActivate {
  private logger: Logger = new Logger('ServicoGuardWs');

  constructor(
    private readonly authService: AuthService,
    private readonly solicitacao: SolicitacaoService,
    private readonly servico: ServicoService,
    
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const client: Socket = context.switchToWs().getClient();
    // Supondo que você tenha uma forma de identificar o usuário, como um token JWT
    
    
    const user = this.extractUser(client); // Implemente a função `extractUser`
    client.data = user; // Armazene os dados do usuário na conexão
    return true;
  }

  private extractUser(client: Socket) {
    try {
      const user = this.authService.verifySync(client.handshake.auth.token);
      return user;
    } catch (error) {
      this.logger.error(error);
    }
    }
}
