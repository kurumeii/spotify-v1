/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { spotifyApi } from '@/config/spotify'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const mainRouter = createTRPCRouter({
  getUserPlaylist: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { session } = ctx
      spotifyApi.setAccessToken(session.spotify.access_token)
      const { body: spotifyResponse } = await spotifyApi.getUserPlaylists(
        session.spotify.providerAccountId,
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
    const { session } = ctx
    try {
      spotifyApi.setAccessToken(session.spotify.access_token)
      const spotifyResponse = await spotifyApi.getMyCurrentPlayingTrack({
        market: 'VN',
      })
      if (!spotifyResponse) throw new TRPCError({ code: 'BAD_REQUEST' })
      const { is_playing, item } = spotifyResponse.body
      return {
        accessToken: session.spotify.access_token,
        is_playing: is_playing,
        trackDetail: item,
      }
    } catch (error) {
      console.error(error)
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }
  }),
  getDetailPlaylistById: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { session } = ctx
      spotifyApi.setAccessToken(session.spotify.access_token)
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
  getUserProfileDetail: protectedProcedure.query(async ({ ctx }) => {
    const { access_token, providerAccountId } = ctx.session.spotify
    spotifyApi.setAccessToken(access_token)
    const { body, statusCode } = await spotifyApi.getUser(providerAccountId)
    if (statusCode !== 200 || !body) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    return {
      ...body,
    }
  }),
})
