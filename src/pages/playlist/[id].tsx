import TableBody from '@/components/Playlists/TableBody'
import TableHead from '@/components/Playlists/TableHead'
import Layout from '@/components/layout/Layout'
import useToggleTheme from '@/hooks/useToggleTheme'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import { PlayIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { type ReactElement } from 'react'
import { type NextPageWithLayout } from '../_app'

const Playlist: NextPageWithLayout = () => {
  const router = useRouter()
  const playlistId = router.query.id as string
  const { isDarkTheme } = useToggleTheme()
  const { data: playlistData } = api.main.getDetailPlaylistById.useQuery({
    playlistId,
  })

  if (!playlistData) return null
  return (
    <>
      <div className='flex h-[90%] flex-1 flex-col p-5'>
        <div className='flex items-center gap-3'>
          {playlistData.images.length > 0 && (
            <div className='group relative'>
              <Image
                src={playlistData.images[0]?.url}
                alt={playlistData.name}
                width={200}
                height={200}
              />
              <div className='absolute top-0 hidden h-full w-full items-center justify-center bg-black/30 group-hover:flex'>
                <button
                  className={cn(
                    'btn-success btn-circle btn-lg btn',
                    isDarkTheme && 'btn-outline '
                  )}
                >
                  <PlayIcon className='h-7 w-7 fill-current stroke-transparent' />
                </button>
              </div>
            </div>
          )}
          <div className='flex flex-col gap-y-3 pb-3'>
            <span className='text-sm'>
              {playlistData.public ? 'Public' : 'Private'} playlist
            </span>
            <h1 className='font-sans text-6xl font-black'>
              {playlistData.name}
            </h1>
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
      </div>
    </>
  )
}

Playlist.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Playlist
