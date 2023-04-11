import Layout from '@/components/layout/Layout'
import { api } from '@/utils/api'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/router'
import { type ReactElement } from 'react'
import { type NextPageWithLayout } from '../_app'

const Playlist: NextPageWithLayout = () => {
  const router = useRouter()
  const playlistId = router.query.id as string
  const { data: playlistData, isLoading } =
    api.main.getDetailPlaylistById.useQuery({
      playlistId,
    })
  if (!playlistData) return null

  return (
    <>
      {isLoading ? (
        <div className='flex h-full flex-1 items-center justify-center'>
          <Loader2Icon className='h-10 w-10 animate-spin ' />
        </div>
      ) : (
        <div className={`no-scrollbar h-full w-full overflow-y-auto`}>
          {/* Cover */}

          {/* Tracks  */}
        </div>
      )}
    </>
  )
}

Playlist.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Playlist
