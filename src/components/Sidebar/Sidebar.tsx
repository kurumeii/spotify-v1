import { HomeIcon, LibraryIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { type FC } from 'react'
import SpotifyLogo from '../SpotifyLogo'
import UserPlaylists from '../UserPlaylists'

import { Separator } from '../ui/Separator'
import CreateNewPlaylist from './CreateNewPlaylist'
import SideBarBtn, { type SidebarProps } from './SideBarBtn'

const coreFunctionBtn: Array<SidebarProps> = [
  {
    Icon: HomeIcon,
    label: 'home',
    link: '/',
  },
  {
    Icon: SearchIcon,
    label: 'search',
    link: '/search',
  },
  {
    Icon: LibraryIcon,
    label: 'Playlists',
    link: '/playlist',
  },
]

const Sidebar: FC = () => {
  return (
    <div className='flex h-full w-full flex-col space-y-4 '>
      <Link href='/'>
        <SpotifyLogo />
      </Link>
      {coreFunctionBtn.map(({ link, ...props }, id) => (
        <Link key={id} href={link ?? '/#'} replace>
          <SideBarBtn {...props} />
        </Link>
      ))}
      <CreateNewPlaylist />
      <Separator />
      <UserPlaylists />
    </div>
  )
}

export default Sidebar
