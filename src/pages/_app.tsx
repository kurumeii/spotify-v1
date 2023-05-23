import { myStore } from '@/store/store'
import '@/styles/globals.css'
import { api } from '@/utils/api'
import { type NextPage } from 'next'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppProps } from 'next/app'
import Head from 'next/head'
import { type ReactElement, type ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type MyAppProps = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps: { ...pageProps } }: MyAppProps) => {
  const getLayout = Component.getLayout ?? (page => page)

  return (
    <>
      <Head>
        <title>Spotify v1</title>
        <meta name='description' content='A spotify cloned' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <SessionProvider session={pageProps.session as Session}>
        <ReduxProvider store={myStore}>
          {getLayout(<Component {...pageProps} />)}
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </ReduxProvider>
      </SessionProvider>
    </>
  )
}

export default api.withTRPC(MyApp)
