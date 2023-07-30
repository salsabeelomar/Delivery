import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  UnauthorizedException,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserService } from 'src/modules/user/user.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { ROOM_GATEWAY, ORDER_GATEWAY } from 'src/common/gateways';
import { ORDER_EVENTS } from 'src/common/events';

@UseGuards()
@WebSocketGateway()
export class GatewayService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    // private orderService: OrderService,
    private eventEmitter: EventEmitter2,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization.split('Bearer ')[1];
    try {
      const decoded = this.jwt.verify(token);
      const user = await this.userService.getUserById(decoded.sub);

      CheckExisting(user, UnauthorizedException);

      switch (user.role) {
        case ROOM_GATEWAY.DELIVERY:
          client.join(ROOM_GATEWAY.DELIVERY);
          break;

        case ROOM_GATEWAY.CLIENT:
          client.join(ROOM_GATEWAY.CLIENT);
          break;

        default: {
          client.disconnect(true);
          throw new ForbiddenException();
        }
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        client.send(new BadRequestException(' Token Expired '));
        client.disconnect(true);
      } else {
        client.send(new UnauthorizedException('Invalid Token '));
        client.disconnect(true);
      }
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage(ORDER_GATEWAY.CERATE)
  async createOrder(client: Socket, payload: any) {
    return payload;
  }
  @OnEvent(ORDER_EVENTS.CREATE)
  showOrder(payload) {
    this.server.to('delivery').emit(ORDER_GATEWAY.CERATE, payload);
  }

  
}
