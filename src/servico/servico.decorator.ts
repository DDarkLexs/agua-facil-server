import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const WsUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const client: Socket = context.switchToWs().getClient();
    return client; // Retorna os dados do usuário armazenados na conexão
  },
);
export const WsParams = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const paramsData: any = context.switchToWs().getData();
    return paramsData; // Retorna os dados do usuário armazenados na conexão
  },
);
