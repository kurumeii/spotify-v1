import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/ContextMenu'
import { usePlaylist } from '@/hooks/usePlaylist'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import { HeadphonesIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { type FC } from 'react'

const UserPlaylists: FC = () => {
  const getUserPlaylists = usePlaylist()
  const removePlaylist = api.main.removePlaylist.useMutation()

  const deleteSavedPlaylist = async (id: string) => {
    await removePlaylist.mutateAsync({
      playlistId: id,
    })
    void getUserPlaylists.refetch()
  }
  return (
    <>
      <div className='no-scrollbar flex flex-col flex-wrap items-start gap-x-3 truncate text-xs'>
        {getUserPlaylists.data.map(({ id, name, isPlaying }) => (
          <ContextMenu key={id}>
            <Link href={`/playlist/${id}`} className='h-10 w-full'>
              <ContextMenuTrigger className='h-full w-full'>
                <div
                  className={cn(
                    'flex flex-1 cursor-pointer items-center justify-between text-base-content opacity-60 transition-opacity hover:opacity-100',
                    isPlaying ? 'opacity-100' : ''
                  )}
                >
                  {name}
                  {isPlaying && (
                    <HeadphonesIcon className='h-4 w-4 stroke-green-500' />
                  )}
                </div>
              </ContextMenuTrigger>
            </Link>
            <ContextMenuContent className=''>
              <ContextMenuItem
                className='text-xs'
                onClick={() => void deleteSavedPlaylist(id)}
              >
                Delete playlist from user
                <ContextMenuShortcut>
                  <Trash2Icon className='ml-3 h-4 w-4 stroke-red-500' />
                </ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    </>
  )
}

export default UserPlaylists
