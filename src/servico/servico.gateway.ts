import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import * as md5 from 'md5';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { SolicitacaoService } from 'src/solicitacao/solicitacao.service';
import { ServicoService } from './servico.service';

@WebSocketGateway({ cors: true })
export class ServicoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly solicitacao: SolicitacaoService,
    private readonly servico: ServicoService,
  ) { }
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ServicoGateway');

  @SubscribeMessage('messageToServer')
  afterInit(server: Server) {
    this.logger.log('Init');
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
    client.disconnect();
    console.log('usuario desconectado');
  }
  @SubscribeMessage('msg')
  async receberMsg(client: Socket, data: any) {
    const user = await this.getUser(client.handshake.auth.token);
    console.log(user.nome);
    client.broadcast.emit('msg_', 'ola');
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

  @SubscribeMessage('joinPrivateAsMotorista')
  async juntarSecomoMotorista(client: Socket, { solicitacaoId }: any): Promise<void> {
    const user = await this.getUser(client.handshake.auth.token);
    let servico;
    if (user) {
      servico = await this.solicitacao.findOneByMotorista(
        solicitacaoId,
        user.motorista.id,
      );
      const hash = md5(servico.id);

      client.join(hash);
      client.broadcast
        // .to(hash)
        .emit('JoinRoomPrivateRoom', `${user.nome} juntou-se`);
      console.log(user.nome, " - ", user.tipo);
    } else {
      client.disconnect();
    }
  }
  @SubscribeMessage('motoristaAceitaSolicitacao')
  handleEvent(client: Socket, data: string) {
    
    return data;
  }

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
  @SubscribeMessage('joinPrivateAsCliente')
  async juntarSecomoCliente(client: Socket, { solicitacaoId }: any): Promise<void> {
    const user = await this.getUser(client.handshake.auth.token);
    let servico;
    if (user) {
      servico = await this.solicitacao.findOneByCliente(
        solicitacaoId,
        user.cliente.id,
      );
      const hash = md5(servico.id);
      client.join(hash);
      client.broadcast
        // .to(hash)
        .emit('JoinRoomPrivateRoom', `${user.nome} juntou-se`);
      console.log(user.nome, " - ", user.tipo);

    } else {
      client.disconnect();
    }
  }

}
