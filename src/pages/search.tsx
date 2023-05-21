import Layout from '@/components/layout/Layout'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/ContextMenu'
import { Input } from '@/components/ui/Input'
import useToggleTheme from '@/hooks/useToggleTheme'
import { getServerAuthSession } from '@/server/auth'
import { togglePlayTrack } from '@/slices/trackSlice'
import { useAppDispatch, type RootState } from '@/store/store'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import dayjs from 'dayjs'
import { Loader2Icon, PauseIcon, PlayIcon } from 'lucide-react'
import { type GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useInViewport } from 'react-in-viewport'
import { useSelector } from 'react-redux'
import { useDebounce } from 'use-debounce'
import { type NextPageWithLayout } from './_app'

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

const Search: NextPageWithLayout = () => {
  const { isDarkTheme } = useToggleTheme()
  const [search, setSearch] = useState('')
  const [query] = useDebounce(search, 1000)
  const [offset, setOffset] = useState(0)
  const searchSong = api.main.searchSong.useQuery(
    {
      query,
      offset,
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: query !== '',
    }
  )
  const {
    playlistObj: { basicInfo },
  } = useSelector((state: RootState) => state.savedPlaylist)
  const { playState, trackProgress, trackUri } = useSelector(
    (state: RootState) => state.track
  )
  const dispatch = useAppDispatch()

  const addTrackToPlaylistMutation = api.main.addTrackToPlaylist.useMutation({
    onError: err => alert(err.message),
    onSuccess: () => alert('Added success'),
  })
  const lastItemInBatch = useRef<HTMLDivElement | null>(null)
  const { inViewport } = useInViewport(lastItemInBatch)
  useEffect(() => {
    inViewport && setOffset(prev => prev + 10)
  }, [inViewport])

  useEffect(() => {
    query === '' && setOffset(0)
  }, [query])

  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <Input
        defaultValue={query}
        onChange={e => setSearch(e.target.value)}
        type='search'
        className='md:max-w-xs'
        placeholder='What song do you want to search ?'
      />
      <br />
      <div className='no-scrollbar grid w-full grid-cols-1 gap-2 overflow-y-auto'>
        {searchSong.data?.songs?.map(
          ({ name, id, duration_ms, album, artists, uri }) => (
            <Fragment key={id}>
              <ContextMenu>
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
                      <div className='group inline-flex h-full w-full cursor-pointer items-center gap-x-5 text-sm'>
                        <div className='relative bg-black/30'>
                          <Image
                            src={album.images[0]?.url || ''}
                            alt={album.images[0]?.url || ''}
                            width={100}
                            height={100}
                            className='object-cover'
                          />
                          <div
                            className={cn(
                              'absolute top-0  h-full w-full items-center justify-center bg-black/30 ',
                              playState && trackUri === uri
                                ? 'flex'
                                : 'hidden group-hover:flex'
                            )}
                          >
                            <button
                              className={cn(
                                'btn-success btn-circle btn-lg btn'
                              )}
                            >
                              {playState && trackUri === uri ? (
                                <PauseIcon className='h-7 w-7 fill-current stroke-transparent' />
                              ) : (
                                <PlayIcon className='h-7 w-7 fill-current stroke-transparent' />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className='truncate'>
                          <span>{name}</span>
                          <br />
                          <span className='text-xs text-base-content/70'>
                            {artists.map(artist => artist.name).join(',')}
                          </span>
                        </div>
                        <div className='mr-5 flex flex-1 justify-end'>
                          {dayjs(duration_ms).format('mm:ss')}
                        </div>
                      </div>
                    )}
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className='w-64'>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger inset>
                      Add to playlist
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className='no-scrollbar h-64 overflow-y-auto'>
                      {basicInfo.map(info => (
                        <ContextMenuItem
                          key={info.id}
                          onClick={() =>
                            addTrackToPlaylistMutation.mutate({
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
            </Fragment>
          )
        )}
        <div
          ref={lastItemInBatch}
          className='inline-flex w-full items-center justify-center'
        >
          {searchSong.isFetching && (
            <Loader2Icon className='h-6 w-6 animate-spin' />
          )}
        </div>
      </div>
    </>
  )
}

Search.getLayout = page => <Layout>{page}</Layout>

export default Search
