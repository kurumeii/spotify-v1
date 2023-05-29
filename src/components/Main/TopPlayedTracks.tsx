import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHook'
import useToggleTheme from '@/hooks/useToggleTheme'
import { setTopPlayed } from '@/slices/topTrackSlice'
import { togglePlayTrack } from '@/slices/trackSlice'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import { PauseIcon, PlayIcon } from 'lucide-react'
import Image from 'next/image'
import { type FC } from 'react'

const TopPlayedTracks: FC = () => {
  const { isDarkTheme } = useToggleTheme()
  const dispatch = useAppDispatch()
  const { data: myTopTracks, isError } = api.main.getMyTopTracks.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      onSuccess: data => {
        dispatch(
          setTopPlayed({
            trackId: data.items
              .filter((item, idx) => idx < 5 && item)
              .map(item => item.id),
          })
        )
      },
    }
  )

  const { playState, trackProgress, trackUri } = useAppSelector(
    state => state.track
  )

  if (isError || !myTopTracks) return null

  return (
    <>
      <h1 className='text-lg'>
        Here&apos;s your top 6 most recently played tracks
      </h1>
      <div className='grid grid-cols-1 gap-x-7 gap-y-5 py-3 lg:grid-cols-2 xl:grid-cols-3'>
        {myTopTracks.items.length > 0 &&
          myTopTracks.items.map(({ album, id, name, uri, artists }) => (
            <div
              key={id}
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
          ))}
      </div>
    </>
  )
}

export default TopPlayedTracks
