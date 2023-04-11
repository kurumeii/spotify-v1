import Layout from '@/components/layout/Layout'

import { getServerAuthSession } from '@/server/auth'

import getDayNight from '@/utils/getDayNight'
import { type GetServerSideProps } from 'next'
import { type ReactElement } from 'react'
import { type NextPageWithLayout } from './_app'

import TopPlayedTracks from '@/components/TopPlayedTracks'

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

const Home: NextPageWithLayout = () => {
  const welcomeText = getDayNight() as string
  return (
    <>
      <main className='no-scrollbar h-screen w-full overflow-y-auto px-8 pb-12 pt-36'>
        <p className='text-4xl font-bold'>Good {welcomeText}</p>
        <br />
        <TopPlayedTracks />
      </main>
    </>
  )
}

Home.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Home
