import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
export class ServicoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

  constructor(private readonly authService: AuthService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ServicoGateway');

  @SubscribeMessage('messageToServer')
  afterInit(server: Server) {
    this.logger.log('Init');
  }


  async getUser(token: string) {
    const user = await this.authService.verify(token);
    delete user.senha;
    return user;
  }

  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(client)
    console.log(client);
    
    const user = await this.getUser(client.handshake.auth.token);
    !user && client.disconnect();
    console.log('Usuario conectado: ', user.nome);
  }
  async handleDisconnect(client: Socket): Promise<void> {
    const user = await this.getUser(client.handshake.auth.token);
    !user && client.disconnect();

    console.log('usuario desconectado: ' + user.nome);
  }

}