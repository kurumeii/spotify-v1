import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown'
import useToggleTheme from '@/hooks/useToggleTheme'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import { ChevronDownIcon, MoonIcon, SunIcon, UserIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'

const UserDropDown = () => {
  const { isDarkTheme, toggleTheme } = useToggleTheme()
  const [isClicked, setClicked] = useState(false)
  const { isError, data: userData } = api.main.getUserProfileDetail.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  )
  if (isError || !userData) return null

  return (
    <DropdownMenu onOpenChange={() => setClicked(prev => !prev)}>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            isDarkTheme
              ? 'bg-zinc-500 text-base-content'
              : 'bg-zinc-900 text-slate-200',
            'flex cursor-pointer items-center justify-center gap-x-2 rounded-full  px-2 py-1 text-sm font-bold '
          )}
        >
          {userData.images !== undefined ? (
            <div className='avatar'>
              <div className='rounded-full'>
                {userData.images[0] !== undefined && (
                  <Image
                    src={userData.images[0]?.url}
                    alt={userData.images[0]?.url}
                    width={20}
                    height={20}
                  />
                )}
              </div>
            </div>
          ) : (
            <UserIcon className='h-6 w-6' />
          )}
          <span>{userData.display_name}</span>
          <ChevronDownIcon
            className={cn(isClicked && 'rotate-180 ', 'transition-transform')}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={10} className='w-48' align='end'>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div className='flex justify-between' onClick={toggleTheme}>
            Change theme
            {isDarkTheme ? <SunIcon /> : <MoonIcon />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void signOut()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropDown
