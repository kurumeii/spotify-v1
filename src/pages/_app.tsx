import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'

import { api } from '@/utils/api'

import '@/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'
import { THEME } from '@/hooks/useToggleTheme'
import { Inter } from 'next/font/google'
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '700'],
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return (
    <>
      <main className={`${inter.className} h-screen w-full overflow-hidden`}>
        <ThemeProvider attribute='data-theme' defaultTheme={THEME.DARK}>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </ThemeProvider>
      </main>
    </>
  )
}

export default api.withTRPC(MyApp)
