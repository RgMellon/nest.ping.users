import { Controller, Logger } from '@nestjs/common';

import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AuthDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private logger = new Logger();
  constructor(private readonly authService: AuthService) {}
  @EventPattern('session')
  async signin(@Payload() body: AuthDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      this.logger.debug('Received session event');
      const res = await this.authService.signin(body);
      channel.ack(originalMessage);
      return res;
    } catch (err) {
      this.logger.error(err);
      channel.ack(originalMessage);
    }
  }
}
