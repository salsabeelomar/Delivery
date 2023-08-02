import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
  Inject,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { DATABASE_CONSTANT } from '../constant';
import { Transaction } from 'sequelize';
import { Observable, catchError, tap } from 'rxjs';
import { WinstonLogger } from '../logging/winston.logger';

@Injectable()
export class TransactionInter implements NestInterceptor {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(DATABASE_CONSTANT.DATABASE_PROVIDE)
    private sequelizeInstance: Sequelize,
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
        this.logger.error('Query Rollback', 'in TransactionInter ');
        transaction.rollback();
        throw new BadGatewayException(err);
      }),
    );
  }
}
