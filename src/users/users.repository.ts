import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: dto,
    });
  }
}
