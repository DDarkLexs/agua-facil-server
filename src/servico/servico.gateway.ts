import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
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
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly solicitacao: SolicitacaoService,
    private readonly servico: ServicoService,
    private readonly locationService: LocalizacaoService,
  ) {}
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
    const user = client.data;
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
  async juntarSecomoMotorista(
    @WsUser() client: Socket,
    @WsParams() data: any,
  ): Promise<void> {
    try {
      const user = client.data;
      let servico;
      if (user) {
        servico = await this.solicitacao.findOneByMotoristaAvailable(
          Number(client.handshake.query.solicitacaoId),
          user.motorista.id,
        );

        if (!servico) {
          throw 'não tem serviço disponível';
        }
        // console.log(servico);

        const hash = md5(servico.id);

        console.log(user.nome, ' - ', user.tipo);
        client.join(hash);
        client.broadcast
          // .to(hash)
          .emit('JoinRoomPrivateRoom', `${user.nome} juntou-se`);
      } else {
        throw 'Utizador inexistente';
      }
    } catch (error) {
      this.logger.error(error);
      client.broadcast.emit('error', error);
      client.disconnect();
    }
  }
  @SubscribeMessage('motoristaAtualizaLocalizacao')
  async motoristaAtualizaLocalizacao(
    @WsUser() client: Socket,
    @WsParams() data: any,
    @WsUserQuery() query: any,
  ) {
    try {
      const user: any = client.data;
      if (user.tipo === $Enums.UsuarioTipo.MOTORISTA) {
        const location =
          await this.locationService.findLocationByCoordenadaAsync(
            data.cordenada,
          );
        this.logger.log('Motorista atualiza localização');
        client.broadcast.emit('motoristaAtualizaLocalizacao', {
          location,
          motorista: user,
        });
      }
    } catch (error) {
      this.logger.error(error);
      client.broadcast.emit('error', error);
      client.disconnect();
    }
  }
  @SubscribeMessage('motoristaAceitaSolicitacao')
  async motoristaAceitaSolicitacao(
    @WsUser() client: Socket,
    @WsUserQuery() query: any,
    @WsParams() data: any,
  ) {
    try {
      const user: any = client.data;
      // this.logger.log(query.solicitacaoId)
      if (user.tipo === $Enums.UsuarioTipo.MOTORISTA) {
        const solicitacao = await this.solicitacao.updateByMotorista(
          Number(query.solicitacaoId),
          user.motorista.id,
          {
            status: $Enums.ServicoStatus.ACEITO,
          },
        );

        const location =
          await this.locationService.findLocationByCoordenadaAsync(
            data.coordenada,
          );
        this.logger.log('Motorista aceitou solicitação');
        client.broadcast.emit('motoristaAceitaSolicitacao', {
          solicitacao,
          utilizador: user,
        });
      } else {
        throw 'Utizador não autorizado';
      }
    } catch (error) {
      this.logger.error(error);
      client.broadcast.emit('error', error);
      client.disconnect();
    }
  }
  @SubscribeMessage('motoristaTerminaSolicitacao')
  async motoristaTerminaSolicitacao(
    @WsUser() client: Socket,
    @WsUserQuery() query: any,
    @WsParams() data: any,
  ) {
    try {
      const user: any = client.data;
      // this.logger.log(query.solicitacaoId)
      if (user.tipo === $Enums.UsuarioTipo.MOTORISTA) {
        const solicitacao = await this.solicitacao.updateByMotorista(
          Number(query.solicitacaoId),
          user.motorista.id,
          {
            status: $Enums.ServicoStatus.CONCLUIDO,
          },
        );

        const location =
          await this.locationService.findLocationByCoordenadaAsync(
            data.coordenada,
          );

        client.broadcast.emit('motoristaTerminaSolicitacao', solicitacao);
      } else {
        throw 'Utizador não autorizado';
      }
    } catch (error) {
      this.logger.error(error);
      client.broadcast.emit('error', error);
      client.disconnect();
    }
  }
  @SubscribeMessage('motoristaRecusaSolicitacao')
  async motoristaRecusaSolicitacao(
    @WsUser() client: Socket,
    @WsUserQuery() query: any,
    @WsParams() data: any,
  ) {
    try {
      const user: any = client.data;
      console.log(query.solicitacaoId)
      if (user.tipo === $Enums.UsuarioTipo.MOTORISTA) {
        const solicitacao = await this.solicitacao.updateByMotorista(
          Number(query.solicitacaoId),
          user.motorista.id,
          {
            status: $Enums.ServicoStatus.RECUSADO,
          },
        );
        this.logger.log('Motorista recusou solicitação');
        client.broadcast.emit('motoristaRecusaSolicitacao', solicitacao);
      } else {
        throw 'Utizador não autorizado';
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
  async juntarSecomoCliente(
    @WsUser() client: Socket,
    @WsParams() data: any,
  ): Promise<void> {
    try {
      const user = client.data;
      let servico;
      if (user) {
        servico = await this.solicitacao.findOneByClienteAvailable(
          Number(client.handshake.query.solicitacaoId),
          user.cliente.id,
        );

        if (!servico) {
          throw 'Não há uma solicitação disponível';
        }
        // console.log(servico);
        // const location = await this.locationService.findLocationByCoordenadaAsync(servico.coordenada)

        const hash = md5(servico.id);
        client.join(hash);
        client.broadcast
          // .to(hash)
          .emit('JoinRoomPrivateRoom', `${user.nome} juntou-se`);
        console.log(user.nome, ' - ', user.tipo);
      } else {
        throw 'Utilizador não autorizado';
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
        throw 'Solicitação inexistente 2';
      }

      if (user.tipo === $Enums.UsuarioTipo.CLIENTE) {
        const update = await this.solicitacao.updateByCliente(
          user.cliente.id,
          servico.id,
          $Enums.ServicoStatus.CANCELADO,
        );
        client.broadcast.emit(
          'clienteCancelaSolicitacao',
          `cliente ${user.nome} cancelou a solicitação`,
        );
      } else {
        throw 'Utilizador não autorizado';
      }
    } catch (error) {
      this.logger.error(error);
      client.broadcast.emit('error', error);
      client.disconnect();
    }
  }
}
