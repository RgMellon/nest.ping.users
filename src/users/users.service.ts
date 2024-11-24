import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { UsersRepository } from './users.repository';
import { RpcException } from '@nestjs/microservices';
import { hash } from 'bcryptjs';
import { AddTokenDto } from './dtos/addToken.dto';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(private readonly userRepository: UsersRepository) {}
  async create(payload: UserDto) {
    try {
      this.logger.debug(`Creating user: ${JSON.stringify(payload)}`);
      const hashUserPassword = await hash(payload.password, 8);

      return await this.userRepository.createUser({
        ...payload,
        password: hashUserPassword,
      });
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async addTokenNotificationOnUser(payload: AddTokenDto) {
    try {
      this.logger.debug(
        `Adding token: ${payload.token} to user: ${JSON.stringify(payload.id)}`,
      );

      const alreadExist = await this.userRepository.getNotificationToken(
        payload.token,
      );

      if (alreadExist) {
        throw new RpcException('Token already exists');
      }

      await this.userRepository.addNotificationTokenToUser(payload);
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
