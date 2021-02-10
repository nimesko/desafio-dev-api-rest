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
  Query,
} from '@nestjs/common';
import { PagingResult } from 'typeorm-cursor-pagination';

import { DatePipe } from './../pipes/date.pipe';
import {
  AccountDTO,
  CreateAccountDTO,
  UpdateAccountDTO,
} from './account.model';
import { AccountService } from './account.service';
import { CreateTransactionDTO, Transaction } from './transaction.model';

@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createAccountDTO: CreateAccountDTO,
  ): Promise<AccountDTO> {
    return plainToClass(
      AccountDTO,
      await this.accountService.create(createAccountDTO),
    );
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<AccountDTO> {
    return plainToClass(AccountDTO, await this.accountService.findById(id));
  }

  @Patch(':id/withdraw')
  withdraw(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    createTransactionDTO: CreateTransactionDTO,
  ): Promise<void> {
    return this.accountService.withdraw(id, createTransactionDTO);
  }

  @Patch(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.accountService.block(id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.accountService.unblock(id);
  }

  @Get(':id/transactions')
  listTransactions(
    @Param('id', ParseIntPipe) id: number,
    @Query('start', DatePipe) start: Date,
    @Query('end', DatePipe) end: Date,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('after') afterCursor: string,
    @Query('before') beforeCursor: string,
  ): Promise<PagingResult<Transaction>> {
    return this.accountService.listTransactions(
      id,
      start,
      end,
      limit,
      beforeCursor,
      afterCursor,
    );
  }

  @Patch(':id/deposit')
  deposit(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    createTransactionDTO: CreateTransactionDTO,
  ): Promise<void> {
    return this.accountService.deposit(id, createTransactionDTO);
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    updateAccountDTO: UpdateAccountDTO,
  ): Promise<AccountDTO> {
    return plainToClass(
      AccountDTO,
      await this.accountService.update(id, updateAccountDTO),
    );
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.accountService.removeById(id);
  }
}
