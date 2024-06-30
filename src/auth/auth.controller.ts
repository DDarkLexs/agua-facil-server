import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from 'src/jwt/jwt.constant';
import { AuthService } from './auth.service';
import { AuthUsuarioDto, CreateUserDriverDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  @UsePipes(ValidationPipe)
  async authenticateDriver(@Body() authUsuarioDto: AuthUsuarioDto) {
    
    return await this.authService.authDriverUsuario(authUsuarioDto);
  }
  @Public()
  @Post('createDriver')
  @UsePipes(ValidationPipe)
  async createDriverUser(@Body() data: CreateUserDriverDto) {
    const { motorista, usuario } = data;
    const created = await this.authService.insertMotoristaUsuario(
      usuario,
      motorista,
    );
    return created;
  }
}
