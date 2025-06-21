import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  async create(dto: CreateUserDto) {
    return this.userRepository.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    });
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const passwordValid: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    return user;
  }
}
