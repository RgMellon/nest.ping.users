import { Injectable } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { UsersRepository } from './users.repository';
import { RpcException } from '@nestjs/microservices';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  async create(payload: UserDto) {
    try {
      const hashUserPassword = await hash(payload.password, 8);

      await this.userRepository.createUser({
        ...payload,
        password: hashUserPassword,
      });
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
