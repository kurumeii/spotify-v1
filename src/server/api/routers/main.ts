import { spotifyApi } from '@/config/spotify'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'

export const mainRouter = createTRPCRouter({
  getUserPlaylist: protectedProcedure.query(async ({ ctx }) => {
    const accountDetail = await ctx.prisma.account.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    })
    if (!accountDetail) throw new TRPCError({ code: 'BAD_REQUEST' })
    const { access_token, providerAccountId } = accountDetail

    try {
      spotifyApi.setAccessToken(access_token)
      const { body: spotifyResponse } = await spotifyApi.getUserPlaylists(
        providerAccountId,
        {
          limit: 10,
        }
      )
      return {
        spotifyResponse,
      }
    } catch (error) {
      console.error(error)
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }
  }),
})
