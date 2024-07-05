import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { CreateMotoristaDto } from './dto/create-motorista.dto';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';
import { MotoristaService } from './motorista.service';

@Controller('motorista')
export class MotoristaController {
  constructor(private readonly motoristaService: MotoristaService) { }


  create(@Body() createMotoristaDto: CreateMotoristaDto) {
    return this.motoristaService.create(createMotoristaDto);
  }

  @Get()
  findAll() {
    return this.motoristaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.motoristaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMotoristaDto: UpdateMotoristaDto) {
    return this.motoristaService.update(+id, updateMotoristaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.motoristaService.remove(+id);
  }
}
