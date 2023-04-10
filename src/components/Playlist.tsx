import { api } from '@/utils/api'
import { Loader2Icon } from 'lucide-react'

const Playlist = () => {
  const { data, isInitialLoading, isSuccess } =
    api.main.getUserPlaylist.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    })

  return (
    <>
      {isInitialLoading ?? (
        <div className='flex h-full flex-1 flex-col items-center justify-center'>
          <Loader2Icon className='h-10 w-10 animate-spin stroke-green-500 ' />
        </div>
      )}
      {isSuccess &&
        data.spotifyResponse.items.map(({ id, name }) => (
          <p key={id}>{name}</p>
        ))}
    </>
  )
}

export default Playlist
