import { WebSpotifyPlayerName } from '@/constant'
import { togglePlayTrack } from '@/slices/trackSlice'
import { type RootState } from '@/store/store'
import { api } from '@/utils/api'
import { useDispatch, useSelector } from 'react-redux'
import SpotifyPlayer from 'react-spotify-web-playback'

const CurrentTrack = () => {
  const { data: currentTrackData } = api.main.getUserCurrentlyPlaying.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      // refetchInterval: 5 * 1000,
    }
  )
  const playState = useSelector((state: RootState) => state.track.playState)
  const trackUri = useSelector((state: RootState) => state.track.trackUri)

  const dispatch = useDispatch()
  return (
    <>
      <SpotifyPlayer
        token={currentTrackData?.accessToken ?? ''}
        uris={trackUri}
        callback={({ progressMs, isPlaying, track }) => {
          dispatch(
            togglePlayTrack({
              playState: isPlaying,
              trackPosition: progressMs,
              trackUri: track.uri,
            })
          )
        }}
        name={WebSpotifyPlayerName.NAME}
        play={playState}
        syncExternalDevice
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
    </>
  )
}

export default CurrentTrack
