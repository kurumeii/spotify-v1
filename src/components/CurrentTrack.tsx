import { WebSpotifyPlayerName } from '@/constant/constants'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHook'
import { togglePlayTrack } from '@/slices/trackSlice'
import { api } from '@/utils/api'
import { useCallback } from 'react'
import SpotifyPlayer, { type CallbackState } from 'react-spotify-web-playback'

const CurrentTrack = () => {
  const dispatch = useAppDispatch()
  const { playState, trackUri, playlistUri, type, trackOffset } =
    useAppSelector(state => state.track)
  const { data: currentTrackData } = api.main.getUserCurrentlyPlaying.useQuery(
    undefined,
    {
      refetchOnWindowFocus: true,
    }
  )

  const callBackFn = useCallback(
    ({ progressMs, isPlaying, track, status }: CallbackState) => {
      status === 'READY' &&
        dispatch(
          togglePlayTrack({
            type,
            playState: isPlaying,
            trackProgress: progressMs,
            trackUri: track.uri,
            playlistUri,
            trackOffset,
          })
        )
    },
    [dispatch, playlistUri, trackOffset, type]
  )

  return (
    <>
      {currentTrackData && (
        <SpotifyPlayer
          token={currentTrackData.accessToken ?? ''}
          uris={type === 'playlist' ? playlistUri || '' : trackUri || ''}
          callback={callBackFn}
          name={WebSpotifyPlayerName.NAME}
          play={playState}
          offset={trackOffset}
          hideAttribution
          styles={{
            activeColor: '#a3a3a3',
            bgColor: '#171717',
            color: '#fff',
            loaderColor: '#22c55e',
            sliderColor: '#1cb954',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff',
            sliderHandleColor: '#fff',
          }}
        />
      )}
    </>
  )
}

export default CurrentTrack
