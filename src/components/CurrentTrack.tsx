/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api } from '@/utils/api'
import { Loader2Icon, PauseIcon, PlayIcon } from 'lucide-react'
import Image from 'next/image'

const CurrentTrack = () => {
  const { data, isLoading, isSuccess, refetch } =
    api.main.getUserCurrentlyPlaying.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
    })
  const trackStateMutation = api.main.togglePausePlay.useMutation()
  if (!data || data.trackDetail === undefined) return null
  return (
    <div className='absolute bottom-0 z-10 h-28 w-full border-t border-t-zinc-800 bg-neutral-900 px-5 text-white md:h-32'>
      {isLoading && (
        <div className='flex h-full w-full items-center justify-center'>
          <Loader2Icon className='flex h-6 w-6 animate-spin' />
        </div>
      )}
      <div className='flex h-full w-full items-center justify-between'>
        <div className='flex items-center justify-center gap-x-2'>
          <Image
            src={
              data.trackDetail?.type === 'track' &&
              data.trackDetail.album.images[0]?.url
            }
            alt={data.trackDetail.name}
            width={70}
            height={70}
            className='h-16 w-16 md:h-20 md:w-20'
          />
          <div className='flex flex-col'>
            <p className='text-sm'>{data.trackDetail.name}</p>
            <span className='text-xs text-neutral-400'>
              {data.trackDetail?.type === 'track' &&
                data.trackDetail.album.artists[0]?.name}
            </span>
          </div>
        </div>
        <div className='flex items-center justify-center'>
          <button
            className='btn-ghost btn-circle btn'
            onClick={() => {
              void trackStateMutation
                .mutateAsync({
                  state: data.is_playing ? 'pause' : 'play',
                })
                .then(() => void refetch())
            }}
          >
            {data.is_playing ? (
              <PauseIcon className='h-5 w-5' />
            ) : (
              <PlayIcon className='h-5 w-5' />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CurrentTrack
