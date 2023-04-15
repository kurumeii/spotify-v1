import { getServerAuthSession } from '@/server/auth'
import { motion } from 'framer-motion'
import { type GetServerSideProps } from 'next'
import { signIn } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'

type Props = {
  session: Awaited<ReturnType<typeof getServerAuthSession>>
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const session = await getServerAuthSession(ctx)
  if (session) {
    return {
      redirect: {
        destination: '/',
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

const Login = () => {
  return (
    <>
      <Head>
        <title>Login | Spotify</title>
      </Head>
      <main className='flex h-screen w-full items-center justify-center overflow-hidden'>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className='card w-96 '
        >
          <div className='card-body'>
            <div className='card-title justify-center'>
              <Image
                src={'/assets/spotify-logo.png'}
                alt='logo'
                width={100}
                height={100}
                priority
              />
            </div>

            <div className='card-actions justify-center'>
              <button
                className='btn-accent btn text-white hover:bg-white hover:text-green-500'
                onClick={() =>
                  void signIn('spotify', {
                    callbackUrl: '/',
                  })
                }
              >
                Sign in with spotify
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  )
}

export default Login
