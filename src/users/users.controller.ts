import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

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
    } catch (err) {
      channel.ack(originalMessage);
    }
  }
}
