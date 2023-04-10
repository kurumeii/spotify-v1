import useToggleTheme from '@/hooks/useToggleTheme'
import { HomeIcon, LibraryIcon, ListPlusIcon, SearchIcon } from 'lucide-react'
import { type FC } from 'react'
import { Separator } from './ui/Separator'

type SidebarProps = { icon: JSX.Element; label: string }

const SideBarBtn: FC<SidebarProps> = ({ icon: Icon, label }) => {
  return (
    <button className='flex w-full items-center gap-x-2 px-2 py-3 transition-colors hover:text-base-content'>
      <Icon className='h-6 w-6' />
      <span className='first-letter:uppercase'>{label}</span>
    </button>
  )
}

const coreFunctionBtn: Array<SidebarProps> = [
  {
    icon: HomeIcon,
    label: 'home',
  },
  {
    icon: SearchIcon,
    label: 'search',
  },
  {
    icon: LibraryIcon,
    label: 'Library',
  },
  {
    icon: ListPlusIcon,
    label: 'create new playlist',
  },
]

const Sidebar = () => {
  const { toggleTheme } = useToggleTheme()
  return (
    <div className='hidden h-screen w-[300px] bg-base-200 px-5 py-7 text-gray-500 md:block md:max-w-md'>
      <div className='flex h-full flex-col space-y-4'>
        <button className='btn-outline btn-success btn' onClick={toggleTheme}>
          Change
        </button>
        {coreFunctionBtn.map(({ ...props }, id) => (
          <SideBarBtn key={id} {...props} />
        ))}
        <Separator />
        {/* Get playlist from current users */}
      </div>
    </div>
  )
}

export default Sidebar
