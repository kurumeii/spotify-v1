import { togglePlayTrack } from '@/slices/trackSlice'
import { type RootState } from '@/store/store'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  PauseIcon,
  PlayIcon,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, type FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'

dayjs.extend(relativeTime)

const TableBody: FC = () => {
  const router = useRouter()
  const playlistId = router.query.id as string
  const [offset, setOffset] = useState(0)
  const { data: tracksObj } = api.main.getTracksFromPlaylist.useQuery(
    {
      playlistId,
      offset,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )
  const { playState, trackUri, trackProgress } = useSelector(
    (state: RootState) => state.track
  )
  const dispatch = useDispatch()
  if (!tracksObj) return null

  return (
    <>
      <tbody>
        {tracksObj.items.length > 0 &&
          tracksObj.items.map(({ track, added_at }, idx) => {
            if (!track) return null
            return (
              <tr
                key={idx}
                className={cn(
                  'group hover text-sm',
                  playState && trackUri === track.uri
                    ? 'active text-green-500'
                    : !playState && trackUri === track.uri
                    ? 'text-green-500'
                    : ''
                )}
                onClick={() => {
                  dispatch(
                    togglePlayTrack({
                      playState:
                        trackUri === track.uri && playState ? false : true,
                      trackProgress: track.uri === trackUri ? trackProgress : 0,
                      type: 'playlist',
                      playlistUri: `spotify:playlist:${playlistId}`,
                      trackUri: track.uri,
                      trackOffset: idx + offset,
                    })
                  )
                  tracksObj.offset
                }}
              >
                <td>
                  <div className='w-1'>
                    {playState && trackUri === track.uri ? (
                      <PauseIcon className='h-4 w-4 fill-green-500 stroke-transparent' />
                    ) : !playState && trackUri === track.uri ? (
                      <PlayIcon className='h-4 w-4 fill-green-500 stroke-transparent' />
                    ) : (
                      <PlayIcon className='hidden h-4 w-4 fill-current stroke-transparent group-hover:block' />
                    )}
                  </div>
                </td>
                <td>
                  <div className='inline-flex items-center gap-x-3'>
                    <Image
                      src={track.album.images[0]?.url ?? ''}
                      alt={track.album.images[0]?.url ?? ''}
                      width={50}
                      height={50}
                    />
                    {track.name}
                  </div>
                </td>
                <td>{track.album.name}</td>
                <td>{added_at && dayjs(added_at).fromNow()}</td>
                <td>{dayjs(track.duration_ms).format('mm:ss')}</td>
              </tr>
            )
          })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={5}>
            <div className='flex items-center justify-center'>
              <div className='btn-group '>
                {/* To very first page */}
                <button
                  className={cn(
                    'btn',
                    offset === 0 ? 'btn-success' : 'btn-ghost '
                  )}
                  onClick={() => setOffset(0)}
                >
                  <ChevronFirstIcon className='mx-2 ' />
                  First
                </button>
                {/* If not the first page, previous page will fetch 10 previous items  */}
                {offset !== 0 && (
                  <button
                    className='btn-ghost btn'
                    title='Previous page'
                    onClick={() => setOffset(prev => prev - 10)}
                  >
                    <ArrowLeftIcon />
                  </button>
                )}
                {/* If not the last page, next page will fetch 10 next items  */}
                {(offset + 10) / 10 !== tracksObj.pages && (
                  <button
                    className='btn-ghost btn'
                    title='Next page'
                    onClick={() => setOffset(prev => prev + 10)}
                  >
                    <ArrowRightIcon />
                  </button>
                )}
                {/* To very last page */}
                <button
                  className={cn(
                    'btn',
                    (offset + 10) / 10 === tracksObj.pages
                      ? 'btn-success'
                      : 'btn-ghost '
                  )}
                  onClick={() => setOffset(tracksObj.pages * 10 - 10)}
                >
                  <ChevronLastIcon className='mx-2 ' />
                  Last
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </>
  )
}

export default TableBody
