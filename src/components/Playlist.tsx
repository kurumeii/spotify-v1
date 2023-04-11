import { api } from '@/utils/api'
import { Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Playlist = () => {
  const { data, isInitialLoading, isSuccess } =
    api.main.getUserPlaylist.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
    })
  return (
    <>
      {isInitialLoading ?? (
        <div className='flex h-full flex-1 flex-col items-center justify-center'>
          <Loader2Icon className='h-10 w-10 animate-spin stroke-green-500 ' />
        </div>
      )}
      <div className='no-scrollbar flex flex-col flex-wrap items-start gap-x-3 gap-y-4 text-xs'>
        {isSuccess &&
          data.spotifyResponse.items.map(({ id, name }) => (
            <Link key={id} href={`/playlist/${id}`}>
              <button className='text-base-content opacity-80 hover:text-white'>
                {name}
              </button>
            </Link>
          ))}
      </div>
    </>
  )
}

export default Playlist
