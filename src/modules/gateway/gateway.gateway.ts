import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import {
  UnauthorizedException,
  UseGuards,
  ForbiddenException,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserService } from 'src/modules/user/user.service';
import { OnEvent } from '@nestjs/event-emitter';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { ROOM_GATEWAY, ORDER_GATEWAY } from 'src/common/gateways';
import { ORDER_EVENTS } from 'src/common/events';
import { Status } from 'src/common/types/enum/status';
import { OrderService } from '../order/order.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@WebSocketGateway(8080)
export class GatewayService
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    @Inject(OrderService) private orderService: OrderService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}
  @WebSocketServer()
  server: Server;
  afterInit(server: any) {
  }
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

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage(ORDER_GATEWAY.CERATE)
  async createOrder(@ConnectedSocket() client: Socket, payload: any) {
    return payload;
  }

  @SubscribeMessage(ORDER_GATEWAY.APPROVED)
  async approvedOrder(
    @MessageBody() payload,
    @ConnectedSocket() client: Socket,
  ) {
   
    this.server.to(ROOM_GATEWAY.CLIENT).emit(ORDER_GATEWAY.APPROVED, 'dhdhh');
  }
  @SubscribeMessage(ORDER_GATEWAY.DISTANCE)
  async ShowDistanceOrder(
    @MessageBody() { id }: { id: number },
    @ConnectedSocket() client: Socket,
  ) {
    return this.orderService.getAddress(id);
  }

  @OnEvent(ORDER_EVENTS.CREATE)
  showOrder(@MessageBody() payload) {
    return payload;
  }

  @OnEvent(ORDER_EVENTS.UPDATE_STATUS)
  updateStatus(
    @MessageBody() { status, clientId }: { status: Status; clientId: number },
  ) {
   
    this.server
      .to(ROOM_GATEWAY.CLIENT)
      .emit(ORDER_GATEWAY.APPROVED, { status, clientId });
  }
}
