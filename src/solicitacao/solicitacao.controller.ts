import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { $Enums, ServicoSolicitado } from '@prisma/client';
import { Autorizacao } from 'src/authorization/authorization.decorator';
import { CreateSolicitacaoByMotoristaIdDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';
import { convertToNumberPipe } from './solicitacao.pipe';
import { SolicitacaoService } from './solicitacao.service';

@Controller('solicitacao')
export class SolicitacaoController {
  constructor(private readonly solicitacaoService: SolicitacaoService) { }

  @Post(":servicoId")
  @UsePipes(ValidationPipe)
  @Autorizacao($Enums.UsuarioTipo.CLIENTE)
  create(@Param('servicoId', convertToNumberPipe) id: number,
    @Body() createSolicitacaoDto: CreateSolicitacaoByMotoristaIdDto,
    @Req() req: any
  ): Promise<ServicoSolicitado> {
    const clienteid = req['usuario']["Cliente"].id;
    return this.solicitacaoService.create(id, Number(clienteid), createSolicitacaoDto);
  }

  @Get()
  findAll() {
    return this.solicitacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSolicitacaoDto: UpdateSolicitacaoDto) {
    return this.solicitacaoService.update(+id, updateSolicitacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solicitacaoService.remove(+id);
  }
}
