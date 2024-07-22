import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { $Enums, ServicoSolicitado } from '@prisma/client';
import { Autorizacao } from 'src/authorization/authorization.decorator';
import { CreateSolicitacaoByMotoristaIdDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoDto, UpdateStatusSolicitacaoDto } from './dto/update-solicitacao.dto';
import { convertToNumberPipe } from './solicitacao.pipe';
import { SolicitacaoService } from './solicitacao.service';

@Controller('solicitacao')
export class SolicitacaoController {
  constructor(private readonly solicitacaoService: SolicitacaoService) { }
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

  @Post(":servicoId")
  @UsePipes(ValidationPipe)
  @Autorizacao($Enums.UsuarioTipo.CLIENTE)
  create(@Param('servicoId', convertToNumberPipe) id: number,
    @Body() createSolicitacaoDto: CreateSolicitacaoByMotoristaIdDto,
    @Req() req: any
  ): Promise<ServicoSolicitado> {
    const clienteid = req['usuario']["Cliente"].id;  
    return this.solicitacaoService.create(id, clienteid, createSolicitacaoDto);
  }
  @Get()
  @UsePipes(ValidationPipe)
  @Autorizacao($Enums.UsuarioTipo.CLIENTE)
  findAll(@Req() req: any) {
    const clienteid = req['usuario']["Cliente"].id;
    return this.solicitacaoService.findAll(clienteid);
  }

  @Get('cliente/:id')
  @Autorizacao($Enums.UsuarioTipo.CLIENTE)
  findOne(@Param('id', convertToNumberPipe) id: number, @Req() req: any) {
    const clienteid = req['usuario']["Cliente"].id;
    return this.solicitacaoService.findOne(id, clienteid);
  }
  @Get('cliente/:id')
  findOneByprops(@Param('id', convertToNumberPipe) id: number, @Req() req: any) {
    const clienteid = req['usuario']["Cliente"].id;
    return this.solicitacaoService.findOne(id, clienteid);
  }
  @Get('historico')
  @Autorizacao($Enums.UsuarioTipo.CLIENTE)
  findAllByhistorico(@Req() req: any) {
    const clienteid = req['usuario']["Cliente"].id;
    return this.solicitacaoService.findAllbyhistorico(clienteid);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSolicitacaoDto: UpdateSolicitacaoDto) {
  //   return this.solicitacaoService.update(+id, updateSolicitacaoDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solicitacaoService.remove(+id);
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

  @Patch("/motorista/status/:servicoId")
  @UsePipes(ValidationPipe)
  @Autorizacao($Enums.UsuarioTipo.MOTORISTA)
  updateStatusSolicitacao(@Param('servicoId', convertToNumberPipe) id: number,
    @Body() createSolicitacaoDto: UpdateSolicitacaoDto,
    @Req() req: any,
    @Param('servicoId', convertToNumberPipe) servicoId: number
  )/* : Promise<ServicoSolicitado> */ {
    const motoristaId = req['usuario']["Motorista"].id;
    
    return this.solicitacaoService.updateByMotorista(servicoId, motoristaId, createSolicitacaoDto);
  }
}
