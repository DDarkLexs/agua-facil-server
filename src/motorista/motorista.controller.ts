import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { Autorizacao } from 'src/authorization/authorization.decorator';
import { UpdateMotoristaCoordenadaDto } from './dto/update-motorista.dto';
import { MotoristaService } from './motorista.service';

@Controller('motorista')
export class MotoristaController {
  constructor(private readonly motoristaService: MotoristaService) {}

  // create(@Body() createMotoristaDto: CreateMotoristaDto) {
  //   return this.motoristaService.create(createMotoristaDto);
  // }

  @Get()
  findAll() {
    return this.motoristaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.motoristaService.findOne(+id);
  }

  @Patch('/atualizarCoordenada')
  @UsePipes(ValidationPipe)
  @Autorizacao($Enums.UsuarioTipo.MOTORISTA)
  updateMotoristaCoordenada(
    @Body() data: UpdateMotoristaCoordenadaDto,
    @Req() req: any,
  ) {
    const user: IUsuarioReq = req.usuario;
    return this.motoristaService.updateCoordenada(data, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.motoristaService.remove(+id);
  }
}
