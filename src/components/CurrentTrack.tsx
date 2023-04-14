import { WebSpotifyPlayerName } from '@/constant'
import { togglePlayTrack } from '@/slices/trackSlice'
import { type RootState } from '@/store/store'
import { api } from '@/utils/api'
import { useDispatch, useSelector } from 'react-redux'
import SpotifyPlayer, { type CallbackState } from 'react-spotify-web-playback'

const CurrentTrack = () => {
  const dispatch = useDispatch()
  const { playState, trackUri, playlistUri, type, trackOffset } = useSelector(
    (state: RootState) => state.track
  )
  const { data: currentTrackData } = api.main.getUserCurrentlyPlaying.useQuery(
    undefined,
    {
      refetchOnWindowFocus: true,
    }
  )

  const updateTrackState = ({
    progressMs,
    isPlaying,
    track,
  }: CallbackState) => {
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
  }

  return (
    <SpotifyPlayer
      token={currentTrackData?.accessToken ?? ''}
      uris={type === 'playlist' ? playlistUri || '' : trackUri || ''}
      callback={updateTrackState}
      magnifySliderOnHover
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
  )
}

export default CurrentTrack
