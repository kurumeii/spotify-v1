/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { spotifyApi } from '@/config/spotify'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import getAccountDetail from '@/utils/getToken'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

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
  getToken: protectedProcedure.query(async ({ ctx }) => {
    const { access_token } = await getAccountDetail(
      ctx.prisma,
      ctx.session.user.id
    )
    return {
      access_token,
    }
  }),
  getDetailPlaylistById: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { access_token } = await getAccountDetail(
        ctx.prisma,
        ctx.session.user.id
      )
      spotifyApi.setAccessToken(access_token)
      const { body: spotifyResponse } = await spotifyApi.getPlaylist(
        input.playlistId,
        {
          market: 'VN',
        }
      )
      if (!spotifyResponse) throw new TRPCError({ code: 'BAD_REQUEST' })
      return {
        ...spotifyResponse,
      }
    }),
})
