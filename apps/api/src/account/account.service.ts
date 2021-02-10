import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Connection, Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';

import { Account, CreateAccountDTO, UpdateAccountDTO } from './account.model';
import { CreateTransactionDTO, Transaction } from './transaction.model';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private connection: Connection,
  ) {}

  create(createModelDTO: CreateAccountDTO): Promise<Account> {
    return this.accountRepository.save(createModelDTO);
  }

  async update(id: number, updateModelDTO: UpdateAccountDTO): Promise<Account> {
    const {
      affected,
    } = await this.accountRepository
      .createQueryBuilder()
      .update()
      .set(updateModelDTO)
      .where('id = :id AND deleted_at IS NULL', { id })
      .execute();
    if (!affected) {
      throw new Error(`No account with id '${id}'`);
    }
    return this.findById(id);
  }

  async removeById(id: number): Promise<void> {
    const result = await this.accountRepository.softDelete(id);
    if (!result.raw.affectedRows) {
      throw new Error(`Unable to delete id '${id}'`);
    }
  }

  async block(id: number): Promise<void> {
    const {
      affected,
    } = await this.accountRepository
      .createQueryBuilder()
      .update()
      .set({ blockedAt: new Date() })
      .where('id = :id AND deleted_at IS NULL', { id })
      .execute();
    if (!affected) {
      throw new Error(`No account with id '${id}'`);
    }
  }

  async unblock(id: number): Promise<void> {
    const {
      affected,
    } = await this.accountRepository
      .createQueryBuilder()
      .update()
      .set({ blockedAt: null })
      .where('id = :id AND deleted_at IS NULL', { id })
      .execute();
    if (!affected) {
      throw new Error(`No account with id '${id}'`);
    }
  }

  findById(id: number): Promise<Account> {
    return this.accountRepository.findOneOrFail(id);
  }

  async withdraw(
    id: number,
    createTransactionDTO: CreateTransactionDTO,
  ): Promise<void> {
    const account = await this.findById(id);
    const start = dayjs().second(0).minute(0).hour(0).millisecond(0).toDate();
    const end = dayjs()
      .second(59)
      .minute(59)
      .hour(23)
      .millisecond(999)
      .toDate();
    const { sum } = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(value + 0)', 'sum')
      .where('account_id = :id', { id })
      .andWhere('created_at BETWEEN :start AND :end', { start, end })
      .andWhere('value < 0')
      .getRawOne();
    const value = Math.abs(createTransactionDTO.value);
    const dailyWithdraw = Math.abs(sum - value);
    const balance = account.balance - value;
    if (balance < 0) {
      throw new HttpException(
        'You do not have enough balance to withdraw',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (dailyWithdraw > account.daily_withdrawal_limit) {
      throw new HttpException(
        'You exceed the daily withdraw limit',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.create(Transaction);
      transaction.value = -value;
      transaction.account = account;
      await queryRunner.manager.save(transaction);

      account.balance = balance;
      await queryRunner.manager.save(account);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deposit(
    id: number,
    createTransactionDTO: CreateTransactionDTO,
  ): Promise<void> {
    const account = await this.findById(id);
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const value = Math.abs(createTransactionDTO.value);
      const transaction = await queryRunner.manager.create(Transaction);
      transaction.value = value;
      transaction.account = account;
      await queryRunner.manager.save(transaction);

      account.balance += value;
      await queryRunner.manager.save(account);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async listTransactions(
    id: number,
    start: Date,
    end: Date,
    limit = 2,
    beforeCursor: string,
    afterCursor: string,
  ): Promise<PagingResult<Transaction>> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('created_at BETWEEN :start AND :end', { start, end });
    const paginator = buildPaginator({
      entity: Transaction,
      query: {
        limit,
        order: 'ASC',
        afterCursor,
        beforeCursor,
      },
    });
    return paginator.paginate(queryBuilder);
  }
}
