import { WebSpotifyPlayerName } from '@/constant/constants'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHook'
import { togglePlayTrack } from '@/slices/trackSlice'
import { api } from '@/utils/api'
import SpotifyPlayer from 'react-spotify-web-playback'

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

  return (
    <>
      {currentTrackData && (
        <SpotifyPlayer
          token={currentTrackData.accessToken ?? ''}
          uris={type === 'playlist' ? playlistUri || '' : trackUri || ''}
          callback={({ progressMs, isPlaying, track, status }) => {
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
          }}
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
