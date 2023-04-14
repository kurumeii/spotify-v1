/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { spotifyApi } from '@/config/spotify'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const mainRouter = createTRPCRouter({
  getUserPlaylists: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { providerAccountId } = ctx.session.spotify
      const { body: spotifyResponse } = await spotifyApi.getUserPlaylists(
        providerAccountId,
        {
          limit: 10,
        }
      )
      const { body: playingState } = await spotifyApi.getMyCurrentPlaybackState(
        {
          market: 'VN',
        }
      )
      let playlistIsPlayingHref = ''
      if (playingState.context) {
        playlistIsPlayingHref = playingState.context.href
      }
      return {
        spotifyResponse,
        playlistIsPlayingHref,
      }
    } catch (error) {
      console.error(error)
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }
  }),
  getUserCurrentlyPlaying: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { access_token } = ctx.session.spotify
      const spotifyResponse = await spotifyApi.getMyCurrentPlayingTrack({
        market: 'VN',
      })
      if (!spotifyResponse) throw new TRPCError({ code: 'BAD_REQUEST' })
      const { is_playing, item, context, progress_ms } = spotifyResponse.body
      return {
        accessToken: access_token,
        is_playing: is_playing,
        trackDetail: item,
        context,
        progress_ms,
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
    .query(async ({ input }) => {
      const { body: spotifyResponse } = await spotifyApi.getPlaylist(
        input.playlistId,
        {
          market: 'VN',
          fields:
            'uri, public, href, id, images, name, owner(display_name), tracks(total)',
        }
      )
      if (!spotifyResponse) throw new TRPCError({ code: 'BAD_REQUEST' })

      return {
        ...spotifyResponse,
      }
    }),
  getUserProfileDetail: protectedProcedure.query(async ({ ctx }) => {
    const { providerAccountId } = ctx.session.spotify

    const { body, statusCode } = await spotifyApi.getUser(providerAccountId)
    if (statusCode !== 200 || !body) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    return {
      ...body,
    }
  }),
  getMyTopTracks: protectedProcedure.query(async () => {
    const { body, statusCode } = await spotifyApi.getMyTopTracks({
      limit: 6,
      time_range: 'short_term',
    })
    if (statusCode !== 200) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    return {
      ...body,
    }
  }),
  getTracksFromPlaylist: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().min(1),
        offset: z.number().min(0).nullish(),
      })
    )
    .query(async ({ input }) => {
      const tracksResponse = await spotifyApi.getPlaylistTracks(
        input.playlistId,
        {
          market: 'VN',
          limit: 10,
          offset: input.offset ?? 0,
          fields:
            'total, offset,items(added_at, track(name, duration_ms, uri, album))',
        }
      )

      if (tracksResponse.statusCode !== 200)
        throw new TRPCError({ code: 'NOT_FOUND' })

      return {
        ...tracksResponse.body,
        pages: Math.ceil(tracksResponse.body.total / 10),
      }
    }),
  getRecommened: protectedProcedure
    .input(
      z.object({
        topTracks: z.string().array().min(1).max(5),
      })
    )
    .query(async ({ input }) => {
      const { body: recommenedBody, statusCode } =
        await spotifyApi.getRecommendations({
          limit: 12,
          market: 'VN',
          seed_tracks: input.topTracks,
          min_popularity: 50,
        })
      if (statusCode !== 200) throw new TRPCError({ code: 'BAD_REQUEST' })
      const { tracks } = recommenedBody
      return {
        tracks,
      }
    }),
})
