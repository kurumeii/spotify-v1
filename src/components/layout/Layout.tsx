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
      className={`${inter.className} box-border h-screen select-none overflow-hidden bg-base-100`}
    >
      <div className='flex h-[90%] w-full flex-1'>
        <Sidebar />
        <div className='h-full w-full'>
          <div className='sticky top-0 flex h-[10%] flex-1 items-center justify-end bg-transparent px-5'>
            <UserDropDown />
          </div>
          <div className='flex h-[90%] flex-1 flex-col p-5'>{children}</div>
        </div>
      </div>
      <footer className='fixed bottom-0 z-30 h-[10%] w-full border-t border-t-zinc-800 bg-neutral-900 px-5 py-3 text-white '>
        <CurrentTrack />
      </footer>
    </main>
  )
}

export default Layout
