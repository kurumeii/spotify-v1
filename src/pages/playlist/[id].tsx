import { api } from '@/utils/api'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/router'

const Playlist = () => {
  const router = useRouter()
  const playlistId = router.query.id as string

  const { data: playlistData, isLoading } =
    api.main.getDetailPlaylistById.useQuery({
      playlistId,
    })

  return (
    <>
      {isLoading && (
        <div className='flex h-full flex-1 items-center justify-center'>
          <Loader2Icon className='h-10 w-10 animate-spin ' />
        </div>
      )}
      <div className='no-scrollbar h-full overflow-y-auto'>{/*  */}</div>
    </>
  )
}

export default Playlist
