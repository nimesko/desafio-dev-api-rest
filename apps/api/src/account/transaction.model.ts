import { f } from '@marcj/marshal';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { NumberGreaterThanZero } from '../validators/number.validators';
import { Account, AccountDTO } from './account.model';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    precision: 13,
    scale: 2,
  })
  value: number;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Account)
  @JoinColumn()
  account: Account;
}

export class CreateTransactionDTO {
  @f.validator(NumberGreaterThanZero)
  value: number;
}

export class TransactionDTO {
  @f
  id: number;

  @f
  value: number;

  @f
  createdAt: Date;

  @f
  account: AccountDTO;
}
