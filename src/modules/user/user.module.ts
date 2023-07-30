import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { authProvider } from '../auth/auth.providers';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, ...authProvider],
  exports: [UserService],
})
export class UserModule {}
