import Layout from '@/components/layout/Layout'
import useToggleTheme from '@/hooks/useToggleTheme'
import { getServerAuthSession } from '@/server/auth'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import getDayNight from '@/utils/getDayNight'
import { type GetServerSideProps } from 'next'
import { type FC, type ReactElement } from 'react'
import { type NextPageWithLayout } from './_app'

type Props = {
  session: Awaited<ReturnType<typeof getServerAuthSession>>
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const session = await getServerAuthSession(ctx)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: true,
      },
    }
  }
  return {
    props: {
      session,
    },
  }
}

const RecentlyPlayedTracks: FC<SpotifyApi.TrackObjectFull> = ({ name }) => {
  const { isDarkTheme } = useToggleTheme()
  return (
    <>
      <div
        className={cn(
          isDarkTheme
            ? 'bg-gray-500 bg-opacity-50 text-white'
            : 'bg-zinc- border-zinc-700 text-zinc-300',
          'h-20 w-full'
        )}
      >
        {name}
      </div>
    </>
  )
}

const Home: NextPageWithLayout = () => {
  const { data: recentlyPlayedData, isError } =
    api.main.getRecentlyPlayedTracks.useQuery(undefined, {
      refetchOnWindowFocus: false,
    })
  const welcomeText = getDayNight() as string
  if (isError || !recentlyPlayedData) return null
  return (
    <>
      <main className='no-scrollbar h-screen w-full overflow-y-auto px-8 pb-12 pt-36'>
        <p className='text-4xl font-bold'>Good {welcomeText}</p>
        <div className='grid grid-cols-3 gap-x-7 gap-y-5 pt-10'>
          {recentlyPlayedData.items.length > 0 &&
            recentlyPlayedData.items.map(({ track }) => (
              <RecentlyPlayedTracks key={track.id} {...track} />
            ))}
        </div>
      </main>
    </>
  )
}

Home.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Home
