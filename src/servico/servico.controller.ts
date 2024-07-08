import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { $Enums, ServicoMotorista } from '@prisma/client';
import { Autorizacao } from 'src/authorization/authorization.decorator';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { ServicoService } from './servico.service';

@Controller('servico')
export class ServicoController {
  constructor(private readonly servicoService: ServicoService) {}
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
  @Post()
  @UsePipes(ValidationPipe)
  @Autorizacao($Enums.UsuarioTipo.MOTORISTA)
  create(
    @Body() createServicoDto: CreateServicoDto,
    @Req() req: any,
  ): Promise<ServicoMotorista> {
    return this.servicoService.create(
      req.usuario.Motorista.id,
      createServicoDto,
    );
  }
  @Get('motorista')
  @Autorizacao($Enums.UsuarioTipo.MOTORISTA)
  findAllByMotorista(@Req() req: any) {
    const user: IUsuarioReq = req.usuario;
    return this.servicoService.findAllByMotorista(user.Motorista.id);
  }
  @Get()
  findAll() {
    return null;
  }
  @Get('motorista/:id')
  @Autorizacao($Enums.UsuarioTipo.MOTORISTA)
  findOne(@Param('id') id: string, @Req() req: any) {
    const user: IUsuarioReq = req.usuario;
    return this.servicoService.findOneWithMotorista(user.Motorista.id, Number(id));
  }
  @Patch(':id')
  @Autorizacao($Enums.UsuarioTipo.MOTORISTA)
  update(
    @Param('id') id: string,
    @Body() updateServicoDto: UpdateServicoDto,
    @Req() req: any,
  ) {
    const user: IUsuarioReq = req.usuario;
    return this.servicoService.update(
      user.Motorista.id,
      Number(id),
      updateServicoDto,
    );
  }
  @Delete(':id')
  @Autorizacao($Enums.UsuarioTipo.MOTORISTA)
  remove(@Param('id') id: string, @Req() req: any) {
    const user: IUsuarioReq = req.usuario;
    return this.servicoService.remove(user.Motorista.id, Number(id));
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

  @Get("disponiveis")
  @Autorizacao($Enums.UsuarioTipo.CLIENTE)
  findAllForClienteDisponiveis(@Req() req: any) {
    // const user: IUsuarioReq = req.usuario;
    return this.servicoService.findAllForClienteDisponiveis();
  }
}
