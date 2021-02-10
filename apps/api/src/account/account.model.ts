import { f } from '@marcj/marshal';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { NumberGreaterThanZero } from '../validators/number.validators';
import { Client, ClientDTO } from './../client/client.model';

export enum AccountType {
  CHECKING_ACCOUNT,
  SAVING_ACCOUNT,
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
  })
  type: AccountType;

  @Column({
    type: 'decimal',
    default: () => 0,
    precision: 13,
    scale: 2,
  })
  balance: number;

  @Column({
    type: 'decimal',
    precision: 13,
    scale: 2,
  })
  daily_withdrawal_limit: number;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  blockedAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
  })
  deletedAt: Date;

  @OneToOne(() => Client)
  @JoinColumn()
  client: Client;
}

export class UpdateAccountDTO {
  @(f.enum(AccountType).optional())
  type?: AccountType;

  @(f.validator(NumberGreaterThanZero).optional())
  daily_withdrawal_limit?: number;
}

export class CreateAccountClientDTO {
  @f
  id: number;
}

export class CreateAccountDTO {
  @f.enum(AccountType)
  type: AccountType;

  @f.validator(NumberGreaterThanZero)
  daily_withdrawal_limit: number;

  @f
  client: CreateAccountClientDTO;
}

export class AccountDTO {
  @f
  id: number;

  @f
  type: AccountType;

  @f
  balance: number;

  @f
  daily_withdrawal_limit: number;

  @f
  deletedAt?: Date;

  @f
  client: ClientDTO;
}
