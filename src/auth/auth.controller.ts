import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from '../jwt/jwt.constant';
import { AuthService } from './auth.service';
import { AuthUsuarioDto, CreateclienteDto, CreateUserDriverDto, CreateUsuarioDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
  @Public()
  @Post('driver/signIn')
  @UsePipes(ValidationPipe)
  async authenticateDriver(@Body() authUsuarioDto: AuthUsuarioDto): Promise<IAuthUserDriver> {
    return await this.authService.authDriverUsuario(authUsuarioDto);
  }
  @Public()
  @Post('driver/signUp')
  @UsePipes(ValidationPipe)
  async createDriverUser(@Body() data: CreateUserDriverDto) {
    const { motorista, usuario } = data;
    const created = await this.authService.insertMotoristaUsuario(
      usuario,
      motorista,
    );
    return created;
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
  @Public()
  @Post('signUp')
  @UsePipes(ValidationPipe)
  async createUser(@Body() data: CreateUsuarioDto) {
    const created = await this.authService.insertClienteUsuario(data);
    return created;
  }

  @Public()
  @Post('signIn')
  @UsePipes(ValidationPipe)
  async authCliente(@Body() authUsuarioDto: AuthUsuarioDto): Promise<IAuthUserCliente> {
    return await this.authService.authClienteUsuario(authUsuarioDto);
  }
}
