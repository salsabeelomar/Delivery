import { Module } from '@nestjs/common';
import { DatabaseProvider } from './database.providers';
import { DATABASE_CONSTANT } from 'src/common/constant';

@Module({
  providers: [...DatabaseProvider],
  exports: [...DatabaseProvider, DATABASE_CONSTANT.DATABASE_PROVIDE],
})
export class DatabaseModule {}
