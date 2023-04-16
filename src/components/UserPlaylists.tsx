import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/ContextMenu'
import { type RootState } from '@/store/store'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import { type QueryObserverResult } from '@tanstack/react-query'
import { HeadphonesIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { type FC } from 'react'
import { useSelector } from 'react-redux'

type Props = {
  refetchData: () => Promise<QueryObserverResult<unknown, unknown>>
}

const UserPlaylists: FC<Props> = ({ refetchData }) => {
  const { playlistObj } = useSelector((state: RootState) => state.savedPlaylist)
  const removePlaylist = api.main.removePlaylist.useMutation()
  const deleteSavedPlaylist = async (id: string) => {
    await removePlaylist.mutateAsync({
      playlistId: id,
    })
    void refetchData()
  }
  return (
    <>
      <div className='no-scrollbar flex flex-col flex-wrap items-start gap-x-3 truncate text-xs'>
        {playlistObj.basicInfo.map(({ id, name, isPlaying }) => (
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
