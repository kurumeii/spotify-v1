import { usePlaylist } from '@/hooks/usePlaylist'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHook'
import { togglePlayTrack } from '@/slices/trackSlice'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import { type QueryObserverResult } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { PauseIcon, PlayIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, type FC } from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '../ui/ContextMenu'

dayjs.extend(relativeTime)

type Refetch = () => Promise<QueryObserverResult<unknown, unknown>>

type Props = {
  page: number
  trackObjItems: SpotifyApi.PlaylistTrackObject[]
  refetchAll: {
    tracksFromPlaylistRefetch: Refetch
    detailPlaylistRefetch: Refetch
  }
}

const TableBody: FC<Props> = ({ page, trackObjItems, refetchAll }) => {
  const router = useRouter()
  const playlistId = router.query.id as string
  const dispatch = useAppDispatch()

  const { playlistObj } = useAppSelector(state => state.savedPlaylist)

  const { playState, trackUri, trackProgress } = useAppSelector(
    state => state.track
  )

  const removeTrack = api.main.removeTrackFromPlaylist.useMutation()
  const savedPlaylist = usePlaylist()

  const removeTrackHandle = useCallback(
    async (uri: string) => {
      const { detailPlaylistRefetch, tracksFromPlaylistRefetch } = refetchAll
      await removeTrack.mutateAsync({ playlistId, trackUri: uri })
      void detailPlaylistRefetch()
      void tracksFromPlaylistRefetch()
    },
    [playlistId, refetchAll, removeTrack]
  )
  return (
    <>
      <tbody>
        {trackObjItems.map(({ track, added_at }, idx) => {
          if (!track) return null
          return (
            <ContextMenu key={idx}>
              <ContextMenuTrigger asChild>
                <tr
                  className={cn(
                    'hover group text-sm',
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
                        trackProgress:
                          track.uri === trackUri ? trackProgress : 0,
                        type: 'playlist',
                        playlistUri: `spotify:playlist:${playlistId}`,
                        trackUri: track.uri,
                        trackOffset: idx + page * 10 - 10,
                      })
                    )
                    void savedPlaylist.refetch()
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
                      <span className='w-full truncate'>{track.name}</span>
                    </div>
                  </td>
                  <td>{track.album.name}</td>
                  <td>{added_at && dayjs(added_at).fromNow()}</td>
                  <td>{dayjs(track.duration_ms).format('mm:ss')}</td>
                </tr>
              </ContextMenuTrigger>
              <ContextMenuContent className='w-64'>
                <ContextMenuItem
                  inset
                  onClick={() => void removeTrackHandle(track.uri)}
                >
                  Remove from playlist
                </ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger inset>
                    Add to playlist
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className='no-scrollbar h-64 overflow-y-auto'>
                    {playlistObj.map(info => (
                      <ContextMenuItem
                        key={info.id}
                        onClick={() => console.log(info.id)}
                      >
                        {info.name}
                      </ContextMenuItem>
                    ))}
                  </ContextMenuSubContent>
                </ContextMenuSub>
              </ContextMenuContent>
            </ContextMenu>
          )
        })}
      </tbody>
    </>
  )
}

export default TableBody
