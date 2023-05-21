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
      className={`${inter.className} box-border select-none overflow-hidden bg-base-100 `}
    >
      <div className='grid h-screen w-full grid-cols-3 grid-rows-3 justify-center overflow-hidden  md:grid-cols-5 '>
        <div className='col-span-1 row-span-3 hidden max-w-[300px] bg-base-300 px-5 py-7 text-sm text-base-content md:block'>
          <Sidebar />
        </div>
        <div className='col-span-3 row-span-3 md:col-span-4'>
          <div className='sticky top-0 flex h-[10%] flex-1 items-center justify-end bg-transparent px-5'>
            <UserDropDown />
          </div>
          <div className='flex h-[90%] flex-1 flex-col p-5'>{children}</div>
        </div>
        <footer className='sticky bottom-0 z-30 col-span-full'>
          <CurrentTrack />
        </footer>
      </div>
    </main>
  )
}

export default Layout
