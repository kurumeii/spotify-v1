import Layout from '@/components/layout/Layout'
import { Input } from '@/components/ui/Input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RouterOutputs, api } from '@/utils/api'
import { ArrowUpIcon, Loader2Icon, PlusCircleIcon } from 'lucide-react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useState, useEffect, useMemo } from 'react'
import { type NextPageWithLayout } from '../_app'
import { useDebounce } from 'use-debounce'
import { cn } from '@/utils/cn'

type Sort = 'asc' | 'desc'

const PlaylistPage: NextPageWithLayout = () => {
  const [search, setSearch] = useState('')
  const [query] = useDebounce(search, 1000)
  const [sortBy, setSortedBy] = useState<Sort>('asc')
  const [playlistData, setPlaylistData] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([])
  const playlists = api.main.getUserPlaylists.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })
  const sorted = useMemo(
    () =>
      playlists.data?.spotifyResponse.items.sort((a, b) => {
        if (sortBy === 'asc') {
          return a.name.toLocaleLowerCase() < b.name.toLowerCase() ? -1 : 1
        } else {
          return a.name.toLocaleLowerCase() > b.name.toLowerCase() ? -1 : 1
        }
      }),
    [playlists.data?.spotifyResponse.items, sortBy]
  )
  useEffect(() => {
    setPlaylistData(sorted ?? [])
  }, [sorted])

  useEffect(() => {
    const filtered = playlists.data?.spotifyResponse.items.filter(({ name }) =>
      name.toLowerCase().includes(query)
    )
    setPlaylistData(
      query === ''
        ? playlists.data?.spotifyResponse.items ?? []
        : filtered ?? []
    )
  }, [, playlists.data?.spotifyResponse.items, query])

  return (
    <>
      <Head>
        <title>Saved playlist</title>
      </Head>
      <div className='flex w-full items-center justify-between'>
        <Input
          type='search'
          className='max-w-xs'
          defaultValue={query}
          placeholder='Search in your library'
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className='btn-ghost btn'
          onClick={() => setSortedBy(prev => (prev === 'asc' ? 'desc' : 'asc'))}
        >
          {sortBy}
          <ArrowUpIcon
            className={cn(
              'ml-2 h-5 w-5 transition-transform',
              sortBy === 'desc' && 'rotate-180'
            )}
          />
        </button>
      </div>
      <br />
      {playlists.isLoading ? (
        <div className='flex w-full items-center justify-center'>
          <Loader2Icon className='h-6 w-6 animate-spin' />
        </div>
      ) : (
        <ScrollArea>
          <div className='grid gap-x-3 gap-y-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {playlistData.length > 0 ? (
              playlistData.map(({ id, name, description, images }) => (
                <Fragment key={id}>
                  <Link passHref legacyBehavior href={`/playlist/${id}`}>
                    <div className='group card cursor-pointer rounded-md bg-neutral-900 text-sm shadow-xl transition-colors hover:bg-neutral-700'>
                      <figure className='relative h-52 w-full'>
                        {images[0] && (
                          <Image
                            src={images[0].url}
                            alt={`cover image for playlist ${name}`}
                            fill
                            className='object-cover opacity-70 transition-opacity group-hover:opacity-100'
                          />
                        )}
                      </figure>
                      <div className='card-body'>
                        <h2 className='card-title'>{name}</h2>
                        <p className='truncate'>{description}</p>
                      </div>
                    </div>
                  </Link>
                </Fragment>
              ))
            ) : (
              <>
                <h3>Not found...</h3>
              </>
            )}
          </div>
        </ScrollArea>
      )}
    </>
  )
}

PlaylistPage.getLayout = page => <Layout>{page}</Layout>

export default PlaylistPage
