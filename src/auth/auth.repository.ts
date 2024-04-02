import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dtos/create-account';
import { PrismaService } from 'src/shared/db/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(createAccountDTO: CreateAccountDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: createAccountDTO.name,
          image_url: createAccountDTO.imageurl ?? ''
        }
      });

      const account = await this.prisma.account.create({
        data: {
          email: createAccountDTO.email,
          password: createAccountDTO.password,
          userId: user.id
        }
      });

      const res = {
        id: user.id,
        name: account.email,
        email: account.email,
        imageUrl: user.image_url
      };
      return res;
    } catch (error) {
      PrismaService.handleError(error);
    }
  }

  async searchAccount(email: string) {
    try {
      const account = await this.prisma.account.findUnique({
        where: { email }
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: account?.userId ?? ''
        }
      });

      if (!user) return null;

      const res = {
        id: user.id,
        name: account.email,
        email: account.email,
        password: account.password,
        imageUrl: user.image_url
      };
      return res;
    } catch (error) {
      PrismaService.handleError(error);
    }
  }
  async finAccountByEmail(email: string) {
    try {
      const Account = this.prisma.account.findUnique({
        where: {
          email
        }
      });

      return Account;
    } catch (error) {
      PrismaService.handleError(error);
    }
  }
  async listAll() {
    return await this.prisma.account.findMany();
  }
  async del() {
    return await this.prisma.account.deleteMany();
  }
}
