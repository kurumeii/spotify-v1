import { scope, spotifyApi } from '@/config/spotify'
import { env } from '@/env.mjs'
import { prisma } from '@/server/db'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { TRPCError } from '@trpc/server'
import { type GetServerSidePropsContext } from 'next'
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    error?: string
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      //First get account info from database
      const { refresh_token, expires_at, providerAccountId } =
        await prisma.account.findFirstOrThrow({
          where: {
            userId: user.id,
            provider: 'spotify',
          },
        })
      //Check if token is about to expire
      if (expires_at * 1000 < Date.now()) {
        try {
          //Call spotify api to get new access token
          spotifyApi.setRefreshToken(refresh_token)
          const { body: spotifyResponseBody } =
            await spotifyApi.refreshAccessToken()
          //Update database
          await prisma.account.update({
            data: {
              access_token: spotifyResponseBody.access_token,
              expires_at: Math.floor(
                Date.now() / 1000 + spotifyResponseBody.expires_in
              ),
              refresh_token: spotifyResponseBody.refresh_token ?? refresh_token,
            },
            where: {
              provider_providerAccountId: {
                provider: 'spotify',
                providerAccountId: providerAccountId,
              },
            },
          })
        } catch (error) {
          console.error('Error', error)
          throw new TRPCError({ code: 'BAD_REQUEST' })
        }
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        url: 'https://accounts.spotify.com/authorize',
        params: {
          scope,
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
}

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) => getServerSession(ctx.req, ctx.res, authOptions)
