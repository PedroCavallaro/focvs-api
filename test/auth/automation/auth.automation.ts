import { Prisma } from '@prisma/client'
import prisma from 'test/db/client'

export type RawAccount = Prisma.AccountGetPayload<unknown>
export type RawUser = Prisma.UserGetPayload<unknown> & RawAccount

export async function addRawUser(account?: Partial<RawAccount>, user?: Partial<RawUser>) {
  const newUser = await prisma.user.create({
    data: {
      name: user?.name ?? 'nome'
    }
  })

  const newAccount = await prisma.account.create({
    data: {
      email: account?.email ?? 'email@email.com',
      password: account?.password ?? '12345678',
      userId: newUser?.id
    }
  })

  return {
    ...newUser,
    ...newAccount
  }
}
