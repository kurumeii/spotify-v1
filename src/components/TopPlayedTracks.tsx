import useToggleTheme from '@/hooks/useToggleTheme'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import { PlayIcon } from 'lucide-react'
import Image from 'next/image'
import { type FC } from 'react'

const TopPlayedTracks: FC = () => {
  const { isDarkTheme } = useToggleTheme()
  const { data: myTopTracks, isError } = api.main.getMyTopTracks.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  )
  if (isError || !myTopTracks) return null
  return (
    <>
      <h1 className='text-lg'>
        Here&apos;s your top 6 most recently played tracks
      </h1>
      <div className='grid grid-cols-1 gap-x-7 gap-y-5 pt-10 lg:grid-cols-2 xl:grid-cols-3'>
        {myTopTracks.items.length > 0 &&
          myTopTracks.items.map(({ album, id, name }) => (
            <div
              key={id}
              className={cn(
                isDarkTheme
                  ? 'bg-zinc-800 hover:bg-zinc-700'
                  : 'bg-base-300 shadow-lg hover:shadow-xl',
                'h-24 w-full overflow-hidden rounded-md pr-5 text-base-content transition-all'
              )}
            >
              {album.images.length > 0 && (
                <section className='group relative inline-flex h-full w-full cursor-pointer items-center gap-x-5 text-sm'>
                  <Image
                    src={album.images[0]?.url}
                    alt={album.images[0]?.url}
                    width={100}
                    height={100}
                  />

                  <span className='truncate'>{name}</span>
                  <div className='flex flex-1 justify-end opacity-0 transition-opacity group-hover:opacity-100'>
                    <button className='btn-success btn-circle btn'>
                      <PlayIcon className='h-6 w-6 fill-black stroke-transparent' />
                    </button>
                  </div>
                </section>
              )}
            </div>
          ))}
      </div>
    </>
  )
}

export default TopPlayedTracks
