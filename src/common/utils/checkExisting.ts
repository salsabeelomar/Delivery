import { WinstonLogger } from '../logging/winston.logger';

export const CheckExisting = (data: any, CustomError, message?: string) => {
  const logger = new WinstonLogger();
  logger.error;
  if (!data) {
    logger.error(` Check Existing ${message}`, CustomError);
    throw new CustomError(message);
  } else return data;
};
