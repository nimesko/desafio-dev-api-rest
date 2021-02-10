import { plainToClass } from '@marcj/marshal';
import { ValidationPipe } from '@marcj/marshal-nest';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ClientDTO, CreateClientDTO, UpdateClientDTO } from './client.model';
import { ClientService } from './client.service';

@Controller('clients')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createClientDTO: CreateClientDTO,
  ): Promise<ClientDTO> {
    return plainToClass(
      ClientDTO,
      await this.clientService.create(createClientDTO),
    );
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ClientDTO> {
    return plainToClass(ClientDTO, await this.clientService.findById(id));
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    updateClientDTO: UpdateClientDTO,
  ): Promise<ClientDTO> {
    return plainToClass(
      ClientDTO,
      await this.clientService.update(id, updateClientDTO),
    );
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.clientService.removeById(id);
  }
}
