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
      try {
        const { body: spotifyResponse } = await spotifyApi.getPlaylist(
          input.playlistId,
          {
            market: 'VN',
            fields:
              'uri, public, href, id, images, name, owner(display_name), tracks(total), description',
          }
        )

        return {
          ...spotifyResponse,
        }
      } catch (error) {
        console.error(error)
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
    }),
  getUserProfileDetail: protectedProcedure.query(async ({ ctx }) => {
    const { providerAccountId } = ctx.session.spotify
    try {
      const { body } = await spotifyApi.getUser(providerAccountId)
      return {
        ...body,
      }
    } catch (error) {
      console.error(error)
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }
  }),
  getMyTopTracks: protectedProcedure.query(async () => {
    try {
      const { body } = await spotifyApi.getMyTopTracks({
        limit: 6,
        time_range: 'short_term',
      })

      return {
        ...body,
      }
    } catch (error) {
      console.error(error)
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }
  }),
  getTracksFromPlaylist: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().min(1),
        page: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { body: playlistResponse } = await spotifyApi.getPlaylist(
          input.playlistId,
          {
            market: 'VN',
            fields: 'tracks.total',
          }
        )

        const tracksResponse = await spotifyApi.getPlaylistTracks(
          input.playlistId,
          {
            market: 'VN',
            limit: 10,
            offset: Math.min(
              10 * input.page - 10,
              playlistResponse.tracks.total
            ),
            fields:
              'total,offset,items(added_at, track(name, duration_ms, uri, album))',
          }
        )
        return {
          ...tracksResponse.body,
          pages: Math.ceil(tracksResponse.body.total / 10),
        }
      } catch (error) {
        console.error(error)
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
    }),
  getRecommened: protectedProcedure
    .input(
      z.object({
        topTracks: z.string().array().max(5),
      })
    )
    .query(async ({ input }) => {
      try {
        const { body: recommenedBody } = await spotifyApi.getRecommendations({
          limit: 12,
          market: 'VN',
          seed_tracks: input.topTracks,
          min_popularity: 50,
        })
        const { tracks } = recommenedBody
        return {
          tracks,
        }
      } catch (error) {
        console.error(error)
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
    }),
  addNewPlaylist: protectedProcedure
    .input(
      z.object({
        playlistName: z.string().optional().default('My playlist'),
        description: z.string().optional().default('My newly created playlist'),
        isPublic: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { isPublic, playlistName, description } = input
      const { body: spotifyResponse } = await spotifyApi.createPlaylist(
        playlistName.trim(),
        {
          description: description.trim(),
          public: isPublic,
        }
      )
      return {
        ...spotifyResponse,
      }
    }),
  addTrackToPlaylist: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().min(1),
        trackUri: z.string().array().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { playlistId, trackUri } = input
        const { body: spotifyResponse } = await spotifyApi.addTracksToPlaylist(
          playlistId,
          trackUri
        )
        return {
          ...spotifyResponse,
        }
      } catch (error) {
        console.error(error)
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
    }),
  removeTrackFromPlaylist: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().min(1),
        trackUri: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { playlistId, trackUri } = input
        await spotifyApi.removeTracksFromPlaylist(playlistId, [
          {
            uri: trackUri,
          },
        ])
        return {
          data: 'OK',
        }
      } catch (error) {
        console.error(error)
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
    }),
  removePlaylist: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { playlistId } = input
        await spotifyApi.unfollowPlaylist(playlistId)
        return {
          data: 'OK',
        }
      } catch (error) {
        console.error(error)
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
    }),
  searchSong: protectedProcedure
    .input(
      z.object({
        query: z.string().trim(),
        offset: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        const songs = []
        for (let i = 0; i <= input.offset; i += 10) {
          const { body, statusCode } = await spotifyApi.searchTracks(
            input.query,
            {
              limit: 10,
              offset: i + 1,
              market: 'VN',
            }
          )
          if (statusCode !== 200 || !body.tracks) {
            throw new TRPCError({ code: 'NOT_FOUND' })
          }
          songs.push(...body.tracks.items)
        }

        return {
          songs,
        }
      } catch (error) {
        console.error(error)
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
    }),
})
