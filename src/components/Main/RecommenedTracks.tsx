import useToggleTheme from '@/hooks/useToggleTheme'
import { togglePlayTrack } from '@/slices/trackSlice'
import { useAppDispatch, type RootState } from '@/store/store'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import { PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '../ui/ContextMenu'

const RecommenedTracks = () => {
  const { playState, trackProgress, trackUri } = useSelector(
    (state: RootState) => state.track
  )
  const {
    playlistObj: { basicInfo },
  } = useSelector((state: RootState) => state.savedPlaylist)
  const { trackId } = useSelector((state: RootState) => state.topPlayedTrack)
  const dispatch = useAppDispatch()

  const {
    data: recommenedData,
    isError,
    refetch,
  } = api.main.getRecommened.useQuery(
    { topTracks: trackId },
    {
      refetchOnWindowFocus: false,
    }
  )

  const { mutate } = api.main.addTrackToPlaylist.useMutation({
    onError: err => alert(err.message),
    onSuccess: () => alert('Added success'),
  })

  const { isDarkTheme } = useToggleTheme()

  if (isError || !recommenedData) return null
  return (
    <>
      <div className='inline-flex w-full justify-between text-lg'>
        <p>Recommened for you</p>
        <button
          className='btn-ghost btn-circle btn items-center justify-center'
          onClick={() => void refetch()}
        >
          <RotateCcwIcon className='h-5 w-5' />
        </button>
      </div>

      <div className='grid grid-cols-1 gap-x-7 gap-y-5 lg:grid-cols-2 xl:grid-cols-3'>
        {recommenedData.tracks.map(({ uri, id, album, name, artists }) => {
          return (
            <ContextMenu key={id}>
              <ContextMenuTrigger>
                <div
                  className={cn(
                    isDarkTheme
                      ? 'bg-zinc-800 hover:bg-zinc-700'
                      : 'bg-base-300 shadow-lg hover:shadow-xl',
                    'h-24 w-full overflow-hidden rounded-md text-base-content transition-all'
                  )}
                  onClick={() => {
                    dispatch(
                      togglePlayTrack({
                        playState: !playState,
                        trackUri: uri,
                        trackProgress,
                        type: 'track',
                      })
                    )
                  }}
                >
                  {album.images.length > 0 && (
                    <div className='group relative inline-flex h-full w-full cursor-pointer items-center gap-x-5 text-sm'>
                      <Image
                        src={album.images[0]?.url || ''}
                        alt={album.images[0]?.url || ''}
                        width={100}
                        height={100}
                      />

                      <div className='truncate'>
                        <span>{name}</span>
                        <br />
                        <span className='text-xs text-base-content/70'>
                          {artists.map(artist => artist.name).join(',')}
                        </span>
                      </div>
                      <div className='flex flex-1 justify-end opacity-0 transition-opacity group-hover:opacity-100'>
                        <button className='btn-success btn-circle btn mr-5'>
                          {playState && trackUri === uri ? (
                            <PauseIcon className='h-6 w-6 fill-black stroke-transparent' />
                          ) : (
                            <PlayIcon className='h-6 w-6 fill-black stroke-transparent' />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className='w-40 min-w-full'>
                <ContextMenuItem>Go to artist</ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>Add to playlist</ContextMenuSubTrigger>
                  <ContextMenuSubContent className='w-40 min-w-max'>
                    {basicInfo.map(info => (
                      <ContextMenuItem
                        key={info.id}
                        onClick={() =>
                          mutate({
                            playlistId: info.id,
                            trackUri: [uri],
                          })
                        }
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
      </div>
    </>
  )
}

export default RecommenedTracks
