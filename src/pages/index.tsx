import { type GetServerSideProps } from 'next'

import Center from '@/components/Center'
import Layout from '@/components/layout/Layout'
import { getServerAuthSession } from '@/server/auth'
import { type ReactElement } from 'react'
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

const Home: NextPageWithLayout = () => {
  return (
    <>
      <main className=''>
        <Center />
      </main>
    </>
  )
}

Home.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Home
