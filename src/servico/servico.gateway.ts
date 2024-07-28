import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { $Enums } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { SolicitacaoService } from 'src/solicitacao/solicitacao.service';
import { ServicoService } from './servico.service';

@WebSocketGateway({ cors: true })
export class ServicoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly solicitacao: SolicitacaoService,
    private readonly servico: ServicoService,
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ServicoGateway');

  @SubscribeMessage('messageToServer')
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  @SubscribeMessage('joinPrivateSolicitacao')
  async privatizarPedido(client: Socket, data: any): Promise<void> {
    const user = await this.getUser(client.handshake.auth.token);
    let servico;
    console.log(user.nome);
    
    if (user) {
      switch (user.tipo) {
        case $Enums.UsuarioTipo.CLIENTE:
          servico = await this.solicitacao.findOneEmCursoCliente(
            user.cliente.id,
          );
          client.join(servico.id);
          client.broadcast
            .to(servico.id)
            .emit('JoinRoomPrivateRoom', `${user.nome} juntou-se`);
          break;

        case $Enums.UsuarioTipo.MOTORISTA:
          servico = await this.solicitacao.findOneEmCursoMotorista(
            user.motorista.id,
          );
          // console.log(servico.id);
          
          client.join(servico.id);
          client.broadcast
            .to(servico.id)
            .emit('JoinRoomPrivateRoom', `${user.nome} juntou-se`);
          break;
        default:
          client.disconnect();
          break;
      }
    } else {
      client.disconnect();
    }
  }
  async getUser(token: string) {
    try {
      const user = await this.authService.verify(token);
      return user;
    } catch (error) {
      this.logger.error(error);
    }
  }
  async handleConnection(client: Socket): Promise<void> {
    // console.log(client);

    const user = await this.getUser(client.handshake.auth.token);

    if (user) {
      this.logger.log(user.nome);
    } else {
      client.disconnect();
      // console.log('Usuario conectado: ', user.nome);
    }
  }
  async handleDisconnect(client: Socket): Promise<void> {
    const user = await this.getUser(client.handshake.auth.token);
    if (!user) {
      client.disconnect();
    } else {
      console.log('usuario desconectado: ' + user.nome);
    }
  }
  /* 
        
      ███▄ ▄███▓ ▒█████  ▄▄▄█████▓ ▒█████   ██▀███   ██▓  ██████ ▄▄▄█████▓ ▄▄▄      
      ▓██▒▀█▀ ██▒▒██▒  ██▒▓  ██▒ ▓▒▒██▒  ██▒▓██ ▒ ██▒▓██▒▒██    ▒ ▓  ██▒ ▓▒▒████▄    
      ▓██    ▓██░▒██░  ██▒▒ ▓██░ ▒░▒██░  ██▒▓██ ░▄█ ▒▒██▒░ ▓██▄   ▒ ▓██░ ▒░▒██  ▀█▄  
      ▒██    ▒██ ▒██   ██░░ ▓██▓ ░ ▒██   ██░▒██▀▀█▄  ░██░  ▒   ██▒░ ▓██▓ ░ ░██▄▄▄▄██ 
      ▒██▒   ░██▒░ ████▓▒░  ▒██▒ ░ ░ ████▓▒░░██▓ ▒██▒░██░▒██████▒▒  ▒██▒ ░  ▓█   ▓██▒
      ░ ▒░   ░  ░░ ▒░▒░▒░   ▒ ░░   ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░░▓  ▒ ▒▓▒ ▒ ░  ▒ ░░    ▒▒   ▓▒█░
      ░  ░      ░  ░ ▒ ▒░     ░      ░ ▒ ▒░   ░▒ ░ ▒░ ▒ ░░ ░▒  ░ ░    ░      ▒   ▒▒ ░
      ░      ░   ░ ░ ░ ▒    ░      ░ ░ ░ ▒    ░░   ░  ▒ ░░  ░  ░    ░        ░   ▒   
            ░       ░ ░               ░ ░     ░      ░        ░                 ░  ░
  */

  /* 
            
      ▄████▄   ██▓     ██▓▓█████  ███▄    █ ▄▄▄█████▓▓█████ 
      ▒██▀ ▀█  ▓██▒    ▓██▒▓█   ▀  ██ ▀█   █ ▓  ██▒ ▓▒▓█   ▀ 
      ▒▓█    ▄ ▒██░    ▒██▒▒███   ▓██  ▀█ ██▒▒ ▓██░ ▒░▒███   
      ▒▓▓▄ ▄██▒▒██░    ░██░▒▓█  ▄ ▓██▒  ▐▌██▒░ ▓██▓ ░ ▒▓█  ▄ 
      ▒ ▓███▀ ░░██████▒░██░░▒████▒▒██░   ▓██░  ▒██▒ ░ ░▒████▒
      ░ ░▒ ▒  ░░ ▒░▓  ░░▓  ░░ ▒░ ░░ ▒░   ▒ ▒   ▒ ░░   ░░ ▒░ ░
        ░  ▒   ░ ░ ▒  ░ ▒ ░ ░ ░  ░░ ░░   ░ ▒░    ░     ░ ░  ░
      ░          ░ ░    ▒ ░   ░      ░   ░ ░   ░         ░   
      ░ ░          ░  ░ ░     ░  ░         ░             ░  ░
      ░                                                      
      */
}
