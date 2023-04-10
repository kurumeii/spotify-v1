import { type GetServerSideProps, type NextPage } from 'next'

import Center from '@/components/Center'
import { getServerAuthSession } from '@/server/auth'

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

const Home: NextPage = () => {
  return (
    <>
      <main className=''>
        <Center />
      </main>
    </>
  )
}

export default Home
