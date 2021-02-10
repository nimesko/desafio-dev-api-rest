import { f } from '@marcj/marshal';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DateISO8601 } from '../validators/date.validators';
import { StringMinMaxLength } from '../validators/string.validators';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 200,
  })
  name: string;

  @Column({
    length: 11,
    unique: true,
  })
  cpf: string;

  @Column({
    type: 'datetime',
  })
  birthday: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
  })
  deletedAt: Date;
}

export class UpdateClientDTO {
  @(f.optional().validator(StringMinMaxLength(1, 200)))
  name?: string;
  @(f.optional().validator(StringMinMaxLength(11, 11)))
  cpf?: string;
  @(f.optional().validator(DateISO8601))
  birthday?: Date;
}

export class CreateClientDTO {
  @f.validator(StringMinMaxLength(1, 200))
  name: string;
  @f.validator(StringMinMaxLength(11, 11))
  cpf: string;
  @f.validator(DateISO8601)
  birthday: Date;
}

export class ClientDTO {
  @f
  id: number;

  @f
  name: string;

  @f
  cpf: string;

  @f
  birthday: Date;
}
