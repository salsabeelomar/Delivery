import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
  Inject,
  Logger,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { DATABASE_CONSTANT } from '../constant';
import { Transaction } from 'sequelize';
import { Observable, catchError, tap } from 'rxjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class TransactionInter implements NestInterceptor {
  constructor(
    @Inject(DATABASE_CONSTANT.DATABASE_PROVIDE)
    private sequelizeInstance: Sequelize,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    const transaction: Transaction = await this.sequelizeInstance.transaction();
    req.transaction = transaction;

    return next.handle().pipe(
      tap(() => {
        this.logger.debug('Query Successfully Passed');
        transaction.commit();
      }),
      catchError((err) => {
        this.logger.error('Query Rollback');
        transaction.rollback();
        throw new BadGatewayException(err);
      }),
    );
  }
}
