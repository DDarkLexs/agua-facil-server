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
import { LocalizacaoService } from 'src/localizacao/localizacao.service';
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
    private readonly locationService: LocalizacaoService,

  ) { }
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ServicoGateway');

  @SubscribeMessage('messageToServer')
  afterInit(server: Server) {
    this.logger.log('Gateway initialized successfully');
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
    console.log(' Usuario desconectado: ', client.id);
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
    try {

      const user = client.data;
      let servico;
      if (user) {

        servico = await this.solicitacao.findOneByMotoristaAvailable(
          Number(client.handshake.query.solicitacaoId),
          user.motorista.id,
        );

        if (!servico) {
          throw "Solicitação inexistente";
        }
        // console.log(servico);

        const hash = md5(servico.id);

        console.log(user.nome, " - ", user.tipo);
        client.join(hash);
        client.broadcast
          // .to(hash)
          .emit('JoinRoomPrivateRoom', `${user.nome} juntou-se`);
      } else {
        throw "Utizador inexistente";
      }
    } catch (error) {

      client.broadcast.emit('error', error);
      client.disconnect();

    }
  }
  @SubscribeMessage('motoristaAceitaSolicitacao')
  handleEvent(@WsUser() client: Socket, @WsUserQuery() query: any, @WsParams() data: any) {
    try {

      const user: any = client.data;
      // this.logger.log(query.solicitacaoId)
      if (user.tipo === $Enums.UsuarioTipo.MOTORISTA) {
        this.solicitacao.updateByMotorista(Number(query.solicitacaoId),
          user.motorista.id,
          {
            status: $Enums.ServicoStatus.ACEITO
          });

        
        client.broadcast.emit('motoristaAceitaSolicitacao', `${user.nome} aceitou`);
      } else {
        throw "Utizador não autorizado";
      }
    } catch (error) {
      this.logger.error(error);
      client.broadcast.emit('error', error);
      client.disconnect();
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
    try {


      const user = client.data;
      let servico;
      if (user) {
        servico = await this.solicitacao.findOneByClienteAvailable(
          Number(client.handshake.query.solicitacaoId),
          user.cliente.id,
        );

        if (!servico) {
          throw "Solicitação inexistente";
        }
        // console.log(servico);
        const location = await this.locationService.findLocationByCoordenadaAsync(servico.coordenada)
        console.log(location.data.address);

        const hash = md5(servico.id);
        client.join(hash);
        client.broadcast
          // .to(hash)
          .emit('JoinRoomPrivateRoom', `${user.nome} juntou-se`);
        console.log(user.nome, " - ", user.tipo);

      } else {
        throw "Utilizador não autorizado";
      }
    } catch (error) {
      this.logger.error(error);
      client.broadcast.emit('error', error);
      client.disconnect();

    }
  }
  @SubscribeMessage('clienteCancelaSolicitacao')
  async clienteCancela(@WsUser() client: Socket, @WsParams() data: any) {
    try {
      const user = client.data;
      const servico = await this.solicitacao.findOneByClienteAvailable(
        Number(client.handshake.query.solicitacaoId),
        user.cliente.id,
      );

      if (!servico) {
        throw "Solicitação inexistente";
      }

      if (user.tipo === $Enums.UsuarioTipo.CLIENTE) {
        const update = await this.solicitacao.updateByCliente(user.cliente.id, servico.id,
          $Enums.ServicoStatus.CANCELADO
        )
        client.broadcast
          .emit('clienteCancelaSolicitacao', `cliente ${user.nome} cancelou a solicitação`);
      } else {
        throw "Utilizador não autorizado";
      }
    } catch (error) {
      this.logger.error(error);
      client.broadcast.emit('error', error);
      client.disconnect();
    }

  }
}
