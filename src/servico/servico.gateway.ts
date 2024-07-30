import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { $Enums } from '@prisma/client';
import * as md5 from 'md5';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { SolicitacaoService } from 'src/solicitacao/solicitacao.service';
import { WsParams, WsUser, WsUserQuery } from './servico.decorator';
import { WsUserGuard } from './servico.guard';
import { ServicoService } from './servico.service';

@WebSocketGateway({ cors: true })
@UseGuards(WsUserGuard)
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
  async handleConnection(@WsUser() client): Promise<void> {

    if (client.id) {
      console.log(client.id);
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
  async receberMsg(@WsUser() client: any, @WsParams() data: any) {
    const user = client.data
    console.log(user);


    console.log(data);
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
  async juntarSecomoMotorista(@WsUser() client: Socket, @WsParams() data: any): Promise<void> {
    const user = client.data;
    let servico;
    if (user) {

      servico = await this.solicitacao.findOneByMotorista(
        Number(client.handshake.query.solicitacaoId),
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
  handleEvent(@WsUser() client: Socket, @WsUserQuery() query: any, @WsParams() data: any) {
    const user: any = client.data;
    // this.logger.log(query.solicitacaoId)
    if (user.tipo === $Enums.UsuarioTipo.MOTORISTA) {
      this.solicitacao.updateByMotorista(Number(query.solicitacaoId),
        user.motorista.id,
        {
          status: $Enums.ServicoStatus.ACEITO
        });
      client.broadcast.emit('motoristaAceitaSolicitacao', `${user.nome} aceitou`);
    }
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
  async juntarSecomoCliente(@WsUser() client: Socket, @WsParams() data: any): Promise<void> {
    const user = client.data;
    let servico;
    if (user) {
      servico = await this.solicitacao.findOneByCliente(
        Number(client.handshake.query.solicitacaoId),
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
  @SubscribeMessage('clienteCancelaSolicitacao')
  async clienteCancela(@WsUser() client: Socket, @WsParams() data: any) {
    const user = client.data;
    const servico = await this.solicitacao.findOneByCliente(
      Number(client.handshake.query.solicitacaoId),
      user.cliente.id,
    );
    if (user.tipo === $Enums.UsuarioTipo.CLIENTE) {
      const update = await this.solicitacao.updateByCliente(user.cliente.id, servico.id,
        $Enums.ServicoStatus.CANCELADO
      )
      client.broadcast
        .emit('clienteCancelaSolicitacao', update);
    }
  }
}
