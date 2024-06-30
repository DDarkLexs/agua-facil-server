/* 


 ▄▄▄        ▄████  █    ██  ▄▄▄        █████▒▄▄▄       ▄████▄   ██▓ ██▓    
▒████▄     ██▒ ▀█▒ ██  ▓██▒▒████▄    ▓██   ▒▒████▄    ▒██▀ ▀█  ▓██▒▓██▒    
▒██  ▀█▄  ▒██░▄▄▄░▓██  ▒██░▒██  ▀█▄  ▒████ ░▒██  ▀█▄  ▒▓█    ▄ ▒██▒▒██░    
░██▄▄▄▄██ ░▓█  ██▓▓▓█  ░██░░██▄▄▄▄██ ░▓█▒  ░░██▄▄▄▄██ ▒▓▓▄ ▄██▒░██░▒██░    
 ▓█   ▓██▒░▒▓███▀▒▒▒█████▓  ▓█   ▓██▒░▒█░    ▓█   ▓██▒▒ ▓███▀ ░░██░░██████▒
 ▒▒   ▓▒█░ ░▒   ▒ ░▒▓▒ ▒ ▒  ▒▒   ▓▒█░ ▒ ░    ▒▒   ▓▒█░░ ░▒ ▒  ░░▓  ░ ▒░▓  ░
  ▒   ▒▒ ░  ░   ░ ░░▒░ ░ ░   ▒   ▒▒ ░ ░       ▒   ▒▒ ░  ░  ▒    ▒ ░░ ░ ▒  ░
  ░   ▒   ░ ░   ░  ░░░ ░ ░   ░   ▒    ░ ░     ░   ▒   ░         ▒ ░  ░ ░   
      ░  ░      ░    ░           ░  ░             ░  ░░ ░       ░      ░  ░
                                                      ░                    

*/
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 1005);
}
bootstrap();