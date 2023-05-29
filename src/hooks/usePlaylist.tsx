import { setSavedPlaylist } from '@/slices/savedPlaylisSlice'
import { api } from '@/utils/api'
import { useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from './useReduxHook'
import { useEffect } from 'react'

export const usePlaylist = () => {
  const { status } = useSession()
  const dispatch = useAppDispatch()
  const { data, isError, isLoading, refetch } =
    api.main.getUserPlaylists.useQuery(undefined, {
      refetchOnWindowFocus: false,
      enabled: status === 'authenticated',
    })

  useEffect(() => {
    if (data) {
      dispatch(
        setSavedPlaylist({
          playlistObj: data.spotifyResponse.items.map(item => ({
            id: item.id,
            name: item.name,
            isPlaying: data.playlistIsPlayingHref === item.href,
          })),
        })
      )
    }
  }, [data, dispatch])

  const { playlistObj } = useAppSelector(state => state.savedPlaylist)

  return {
    data: playlistObj,
    isLoading,
    isError,
    refetch,
  }
}
