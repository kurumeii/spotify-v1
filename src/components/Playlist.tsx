import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import { HeadphonesIcon, Loader2Icon } from 'lucide-react'
import Link from 'next/link'

const Playlist = () => {
  const {
    data: userPlaylistData,
    isLoading,
    isError,
  } = api.main.getUserPlaylist.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: 10 * 1000,
    refetchIntervalInBackground: true,
  })
  const { data: currentTrackData } = api.main.getUserCurrentlyPlaying.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  )

  if (isError || !userPlaylistData || !currentTrackData) return false
  return (
    <>
      {isLoading ?? (
        <div className='flex h-full flex-1 flex-col items-center justify-center'>
          <Loader2Icon className='h-10 w-10 animate-spin stroke-green-500 ' />
        </div>
      )}
      <div className='no-scrollbar flex flex-col flex-wrap items-start gap-x-3 gap-y-4 text-xs'>
        {userPlaylistData.spotifyResponse.items.map(({ id, name, href }) => (
          <Link key={id} href={`/playlist/${id}`} className='w-full'>
            <p
              className={cn(
                'flex flex-1 cursor-pointer items-center justify-between text-base-content opacity-60 transition-opacity hover:opacity-100',
                href === currentTrackData.context?.href ? 'opacity-100' : ''
              )}
            >
              {name}
              {href === currentTrackData.context?.href && (
                <HeadphonesIcon className='h-4 w-4 stroke-green-500' />
              )}
            </p>
          </Link>
        ))}
      </div>
    </>
  )
}

export default Playlist
