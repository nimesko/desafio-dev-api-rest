import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client, CreateClientDTO, UpdateClientDTO } from './client.model';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findById(id: number): Promise<Client> {
    return this.clientRepository.findOneOrFail(id);
  }

  async create(createModelDTO: CreateClientDTO): Promise<Client> {
    if (!this.isCPFValid(createModelDTO.cpf)) {
      throw new Error(`CPF '${createModelDTO.cpf}' is invalid`);
    }
    return this.clientRepository.save(createModelDTO);
  }

  async update(id: number, updateModelDTO: UpdateClientDTO): Promise<Client> {
    if (updateModelDTO.cpf && !this.isCPFValid(updateModelDTO.cpf)) {
      throw new Error(`CPF '${updateModelDTO.cpf}' is invalid`);
    }
    const {
      affected,
    } = await this.clientRepository
      .createQueryBuilder()
      .update()
      .set(updateModelDTO)
      .where('id = :id AND deleted_at IS NULL', { id })
      .execute();
    if (!affected) {
      throw new Error(`No client with id '${id}'`);
    }
    return this.findById(id);
  }

  async removeById(id: number): Promise<void> {
    const result = await this.clientRepository.softDelete(id);
    if (!result.raw.affectedRows) {
      throw new Error(`Unable to delete id "${id}"`);
    }
  }

  isCPFValid(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    if (
      cpf.length != 11 ||
      cpf == '00000000000' ||
      cpf == '11111111111' ||
      cpf == '22222222222' ||
      cpf == '33333333333' ||
      cpf == '44444444444' ||
      cpf == '55555555555' ||
      cpf == '66666666666' ||
      cpf == '77777777777' ||
      cpf == '88888888888' ||
      cpf == '99999999999'
    )
      return false;
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) return false;
    return true;
  }
}
