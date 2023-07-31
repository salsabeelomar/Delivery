import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TransactionDec = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.transaction;
  },
);
