import { THEME } from '@/hooks/useToggleTheme'
import { myStore } from '@/store/store'
import '@/styles/globals.css'
import { api } from '@/utils/api'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type NextPage } from 'next'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
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
      <ThemeProvider
        attribute='data-theme'
        disableTransitionOnChange
        defaultTheme={THEME.DARK}
        themes={[THEME.DARK]}
      >
        <SessionProvider session={pageProps.session as Session}>
          <ReduxProvider store={myStore}>
            {getLayout(<Component {...pageProps} />)}
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </ReduxProvider>
        </SessionProvider>
      </ThemeProvider>
    </>
  )
}

export default api.withTRPC(MyApp)
