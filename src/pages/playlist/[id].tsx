import TableBody from '@/components/Playlists/TableBody'
import TableHead from '@/components/Playlists/TableHead'
import Layout from '@/components/layout/Layout'
import { getServerAuthSession } from '@/server/auth'
import { togglePlayTrack } from '@/slices/trackSlice'
import { type RootState } from '@/store/store'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import { PauseIcon, PlayIcon } from 'lucide-react'
import { type GetServerSideProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { type ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { type NextPageWithLayout } from '../_app'

type Props = {
  session: Awaited<ReturnType<typeof getServerAuthSession>>
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const session = await getServerAuthSession(ctx)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: true,
      },
    }
  }
  return {
    props: {
      session,
    },
  }
}

const Playlist: NextPageWithLayout = () => {
  const router = useRouter()
  const playlistId = router.query.id as string
  const { data: playlistData } = api.main.getDetailPlaylistById.useQuery(
    {
      playlistId,
    },
    { refetchOnWindowFocus: false }
  )

  const { playState, trackProgress, playlistUri } = useSelector(
    (state: RootState) => state.track
  )
  const dispatch = useDispatch()
  if (!playlistData) return null
  return (
    <>
      <div className='flex items-center gap-3'>
        {playlistData.images.length > 0 && (
          <div
            className='group relative cursor-pointer'
            onClick={() => {
              dispatch(
                togglePlayTrack({
                  playState: !playState,
                  type: 'playlist',
                  playlistUri: playlistData.uri,
                  trackProgress,
                })
              )
            }}
          >
            <Image
              src={playlistData.images[0]?.url}
              alt={playlistData.name}
              width={200}
              height={200}
            />
            <div className='absolute top-0 hidden h-full w-full items-center justify-center bg-black/30 group-hover:flex'>
              <button className={cn('btn-success btn-circle btn-lg btn')}>
                {playState && playlistUri === playlistData.uri ? (
                  <PauseIcon className='h-7 w-7 fill-current stroke-transparent' />
                ) : (
                  <PlayIcon className='h-7 w-7 fill-current stroke-transparent' />
                )}
              </button>
            </div>
          </div>
        )}
        <div className='flex flex-col gap-y-3 pb-3'>
          <span className='text-sm'>
            {playlistData.public ? 'Public' : 'Private'} playlist
          </span>
          <h1 className='font-sans text-6xl font-black'>{playlistData.name}</h1>
          <div className=' flex flex-col gap-y-2 text-sm'>
            {playlistData.description !== null && (
              <span className='text-xs opacity-75'>
                {playlistData.description}
              </span>
            )}
            {playlistData.owner.display_name} - {playlistData.tracks.total}{' '}
            songs
          </div>
        </div>
      </div>
      <div className='no-scrollbar flex h-1/2 flex-1 overflow-y-auto '>
        <table className='table w-full '>
          <TableHead />
          <TableBody />
        </table>
      </div>
    </>
  )
}

Playlist.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Playlist
