import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AddTokenDto } from './dtos/addToken.dto';

@Controller('')
export class UsersController {
  private logger = new Logger(UsersController.name);

  constructor(private userService: UsersService) {}

  @EventPattern('create-user')
  async createUser(@Payload() body: UserDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      this.logger.debug(`Received create-user event: ${JSON.stringify(body)}`);
      this.userService.create(body);
      await channel.ack(originalMessage);
      return 'User created successfully';
    } catch (err) {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('add-notification-token')
  async addNotitifcationToken(
    @Payload() body: AddTokenDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      this.logger.debug(
        `Received addNotitifcationToken event: ${JSON.stringify(body)}`,
      );
      this.userService.addTokenNotificationOnUser(body);
      await channel.ack(originalMessage);

      return {
        success: true,
        message: 'Token added successfully',
      };
    } catch (err) {
      await channel.ack(originalMessage);
      throw new RpcException(err);
    }
  }
}
