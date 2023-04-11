import CurrentTrack from '@/components/CurrentTrack'
import Sidebar from '@/components/Sidebar'
import { Inter } from 'next/font/google'
import { type FC } from 'react'
import UserDropDown from '../UserDropDown'

type Props = {
  children: JSX.Element
}

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '700'],
})

const Layout: FC<Props> = ({ children }) => {
  return (
    <main
      className={`${inter.className} relative flex h-screen  w-full select-none overflow-hidden bg-base-100`}
    >
      <Sidebar />
      {children}
      <CurrentTrack />
      <UserDropDown />
    </main>
  )
}

export default Layout
