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
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AddressService } from '../address/address.service';

@WebSocketGateway(8080)
export class GatewayService
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    @Inject(AddressService) private addressService: AddressService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}
  @WebSocketServer()
  server: Server;
  afterInit(server: any) {}
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
          client.join(ROOM_GATEWAY.CLIENT + user.id);
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

  @SubscribeMessage(ORDER_GATEWAY.DISTANCE)
  async ShowDistanceOrder(
    @MessageBody() { addressId }: { addressId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { time, userId } = await this.addressService.getAddress(addressId);

    if (time < 2) {
      this.server
        .to(ROOM_GATEWAY.CLIENT + userId)
        .emit(ORDER_GATEWAY.DISTANCE, {
          message: time,
        });
    }
  }

  @OnEvent(ORDER_EVENTS.CREATE)
  showOrder(@MessageBody() payload) {
    this.server.to(ROOM_GATEWAY.DELIVERY).emit(ORDER_GATEWAY.CERATE, payload);
  }

  @OnEvent(ORDER_EVENTS.UPDATE_STATUS)
  updateStatus(
    @MessageBody() { status, clientId }: { status: Status; clientId: number },
  ) {
    this.server
      .to(ROOM_GATEWAY.CLIENT + clientId)
      .emit(ORDER_GATEWAY.UPDATE_STATUS, { status, clientId });
  }
}
