import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Roles } from './common/guard/roles.guard';
import { AuthGuard } from './common/guard/auth.guard';
import { UserService } from './modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { transports, format } from 'winston';
import { WinstonModule } from 'nest-winston';
import { RequestInterceptor } from './common/interceptor/request.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),

        new transports.DailyRotateFile({
          filename: `logs/%DATE%-combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });

  const reflect = app.get<Reflector>(Reflector);
  const userService = app.get<UserService>(UserService);
  const jwt = app.get<JwtService>(JwtService);
  app.enableCors();

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AuthGuard(reflect, userService, jwt));
  app.useGlobalGuards(new Roles(reflect));
  app.useGlobalInterceptors(new RequestInterceptor());

  await app.listen(3000);
}
bootstrap();
