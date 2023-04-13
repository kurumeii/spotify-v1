import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  PlayIcon,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, type FC } from 'react'

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

  if (!tracksObj) return null

  return (
    <>
      <tbody>
        {tracksObj.items.length > 0 &&
          tracksObj.items.map(({ track, added_at }, idx) => {
            if (!track) return null
            return (
              <tr key={idx} className='group hover text-sm'>
                <td>
                  <div className='w-1'>
                    <PlayIcon className='hidden h-4 w-4 fill-current stroke-transparent group-hover:block' />
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
              <div className='btn-group'>
                <button
                  className={cn('btn', offset === 0 && 'btn-success')}
                  onClick={() => setOffset(0)}
                >
                  <ChevronFirstIcon className='mx-2 h-6 w-6' />
                  First
                </button>
                {offset !== 0 && <button className='btn'>Prev</button>}
                <button className='btn'>...</button>
                <button className='btn'>Next</button>
                <button
                  className={cn(
                    'btn',
                    (offset + 10) / 10 === tracksObj.pages && 'btn-success'
                  )}
                  onClick={() => setOffset(tracksObj.pages * 10 - 10)}
                >
                  {/* {tracksObj.pages} */}
                  <ChevronLastIcon className='mx-2 h-6 w-6' />
                  Last
                </button>
                {/* {[...Array<number>(tracksObj.pages).keys()].map((v, idx) => (
                  <button
                    key={idx}
                    className={cn('btn', page + 1 === v + 1 && 'btn-active')}
                  >
                    Page {v + 1}
                  </button>
                ))} */}
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </>
  )
}

export default TableBody
