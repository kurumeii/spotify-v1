/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { spotifyApi } from '@/config/spotify'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { type PrismaClient } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

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

export const mainRouter = createTRPCRouter({
  getUserPlaylist: protectedProcedure.query(async ({ ctx }) => {
    const { access_token, providerAccountId } = await getAccountDetail(
      ctx.prisma,
      ctx.session.user.id
    )
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
  getUserCurrentlyPlaying: protectedProcedure.query(async ({ ctx }) => {
    const { access_token } = await getAccountDetail(
      ctx.prisma,
      ctx.session.user.id
    )
    try {
      spotifyApi.setAccessToken(access_token)
      const spotifyResponse = await spotifyApi.getMyCurrentPlayingTrack({
        market: 'VN',
      })
      if (!spotifyResponse) throw new TRPCError({ code: 'BAD_REQUEST' })
      const { is_playing, item } = spotifyResponse.body
      return {
        is_playing: is_playing,
        trackDetail: item,
      }
    } catch (error) {
      console.error(error)
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }
  }),
  togglePausePlay: protectedProcedure
    .input(
      z.object({
        state: z.enum(['play', 'pause']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { access_token } = await getAccountDetail(
        ctx.prisma,
        ctx.session.user.id
      )
      try {
        spotifyApi.setAccessToken(access_token)
        input.state === 'play'
          ? await spotifyApi.play()
          : input.state === 'pause'
          ? await spotifyApi.pause()
          : ''
        return {
          data: 'ok',
        }
      } catch (error) {
        console.error(error)
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
    }),
})
