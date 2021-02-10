import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountController } from './account.controller';
import { Account } from './account.model';
import { AccountService } from './account.service';
import { Transaction } from './transaction.model';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction])],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
