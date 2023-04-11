import {
  HomeIcon,
  LibraryIcon,
  ListPlusIcon,
  type LucideIcon,
  SearchIcon,
} from 'lucide-react'
import Link from 'next/link'
import { type ButtonHTMLAttributes, type FC } from 'react'
import Playlist from './Playlist'
import SpotifyLogo from './SpotifyLogo'
import { Separator } from './ui/Separator'

type SidebarProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  Icon: LucideIcon
  label: string
  link?: string
}

const SideBarBtn: FC<SidebarProps> = ({ Icon, label, link, ...props }) => {
  return (
    <>
      <Link href={link ?? '/#'} replace>
        <button
          className='flex w-full items-center gap-x-2 px-2 pt-2 transition-colors hover:text-base-content'
          {...props}
        >
          <Icon className='h-6 w-6' />
          <span className='first-letter:uppercase'>{label}</span>
        </button>
      </Link>
    </>
  )
}

const coreFunctionBtn: Array<SidebarProps> = [
  {
    Icon: HomeIcon,
    label: 'home',
    link: '/',
  },
  {
    Icon: SearchIcon,
    label: 'search',
  },
  {
    Icon: LibraryIcon,
    label: 'Library',
  },
]

const Sidebar = () => {
  return (
    <div className='hidden h-screen w-1/3 max-w-sm bg-base-300 px-5 py-7 text-base-content md:block'>
      <div className='flex h-full flex-col space-y-4 '>
        <Link href='/'>
          <SpotifyLogo />
        </Link>
        {coreFunctionBtn.map(({ ...props }, id) => (
          <SideBarBtn key={id} {...props} />
        ))}
        <div className='pt-4'>
          <SideBarBtn
            Icon={ListPlusIcon}
            label='Create new library'
            onClick={() => console.log('asd')}
          />
        </div>
        <Separator />
        {/* Get playlist from current users */}
        <Playlist />
      </div>
    </div>
  )
}

export default Sidebar
