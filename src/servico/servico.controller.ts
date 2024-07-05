import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { $Enums, ServicoMotorista } from '@prisma/client';
import { Autorizacao } from 'src/authorization/authorization.decorator';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { ServicoService } from './servico.service';

@Controller('servico')
export class ServicoController {
  constructor(private readonly servicoService: ServicoService) { }

  @Post()
  @UsePipes(ValidationPipe)
  @Autorizacao($Enums.UsuarioTipo.MOTORISTA)
  create(@Body() createServicoDto: CreateServicoDto, @Req() req: any): Promise<ServicoMotorista> {
    return this.servicoService.create(createServicoDto, req.usuario.Motorista.id);
  }
  @Get()
  findAll() {
    return this.servicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto) {
    return this.servicoService.update(+id, updateServicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicoService.remove(+id);
  }
}
