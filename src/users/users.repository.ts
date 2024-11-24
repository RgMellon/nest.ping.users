import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dtos/user.dto';
import { AddTokenDto } from './dtos/addToken.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(payload: UserDto) {
    await this.prisma.user.create({
      data: payload,
    });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async addNotificationTokenToUser(payload: AddTokenDto) {
    await this.prisma.user.update({
      where: {
        id: payload.id,
      },
      data: {
        token_notification: payload.token,
      },
    });
  }

  async getNotificationToken(token: string) {
    return await this.prisma.user.findFirst({
      where: {
        token_notification: token,
      },
    });
  }
}
