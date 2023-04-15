import { type RootState } from '@/store/store'
import { cn } from '@/utils/cn'
import { HeadphonesIcon } from 'lucide-react'
import Link from 'next/link'
import { useSelector } from 'react-redux'

const UserPlaylists = () => {
  const { playlistObj } = useSelector((state: RootState) => state.savedPlaylist)

  return (
    <>
      <div className='no-scrollbar flex flex-col flex-wrap items-start gap-x-3 gap-y-4 truncate text-xs'>
        {playlistObj.basicInfo.map(({ id, name, isPlaying }) => (
          <Link key={id} href={`/playlist/${id}`} className='w-full'>
            <p
              className={cn(
                'flex flex-1 cursor-pointer items-center justify-between text-base-content opacity-60 transition-opacity hover:opacity-100',
                isPlaying ? 'opacity-100' : ''
              )}
            >
              {name}
              {isPlaying && (
                <HeadphonesIcon className='h-4 w-4 stroke-green-500' />
              )}
            </p>
          </Link>
        ))}
      </div>
    </>
  )
}

export default UserPlaylists
