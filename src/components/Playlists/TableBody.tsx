import { api } from '@/utils/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { PlayIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { type FC } from 'react'

dayjs.extend(relativeTime)

const TableBody: FC = () => {
  const router = useRouter()
  const playlistId = router.query.id as string

  const { data: tracksObj } = api.main.getTracksFromPlaylist.useQuery(
    {
      playlistId,
    },
    {
      refetchOnWindowFocus: false,
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
              <tr key={idx} className='hover group text-sm'>
                <th>
                  <div className='w-1'>
                    <span className='group-hover:hidden'>{idx + 1}</span>
                    <PlayIcon className='hidden h-4 w-4 fill-current stroke-transparent group-hover:block' />
                  </div>
                </th>
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
    </>
  )
}

export default TableBody
