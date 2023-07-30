import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Roles } from './common/guard/roles.guard';
import { AuthGuard } from './common/guard/auth.guard';
import { UserService } from './modules/user/user.service';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const reflect = app.get<Reflector>(Reflector);
  const userService = app.get<UserService>(UserService);
  const jwt = app.get<JwtService>(JwtService);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AuthGuard(reflect, userService, jwt));
  app.useGlobalGuards(new Roles(reflect));
  await app.listen(3000);
}
bootstrap();
