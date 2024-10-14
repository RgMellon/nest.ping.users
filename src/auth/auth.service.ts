import { Injectable } from '@nestjs/common';
import { AuthDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';
import { compare } from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userRepository: UsersRepository,
  ) {}
  async signin(auth: AuthDto) {
    const { email, password } = auth;

    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new RpcException('User credentials not found');
    }

    const isPassword = await compare(password, user.password);

    if (!isPassword) {
      throw new RpcException('User credentials not found');
    }

    const token = this.jwt.sign({
      sub: user.id,
    });

    return {
      access_token: token,
    };
  }
}
