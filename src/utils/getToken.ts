import { type PrismaClient } from '@prisma/client'
import { TRPCError } from '@trpc/server'

const getAccountDetail = async (prisma: PrismaClient, userId: string) => {
  const accountDetail = await prisma.account.findFirst({
    where: {
      userId,
    },
  })
  if (!accountDetail) throw new TRPCError({ code: 'BAD_REQUEST' })
  return {
    access_token: accountDetail.access_token as string,
    providerAccountId: accountDetail.providerAccountId,
  }
}

export default getAccountDetail
