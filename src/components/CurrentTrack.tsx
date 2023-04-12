import { api } from '@/utils/api'
import SpotifyPlayer from 'react-spotify-web-playback'

const CurrentTrack = () => {
  const { data: currentTrackData, refetch } =
    api.main.getUserCurrentlyPlaying.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    })

  return (
    <>
      <SpotifyPlayer
        token={
          currentTrackData !== undefined ? currentTrackData.accessToken : ''
        }
        uris={
          currentTrackData !== undefined
            ? (currentTrackData.is_playing &&
                currentTrackData.trackDetail.uri) ??
              ''
            : ''
        }
        callback={({ isPlaying }) => {
          !isPlaying && void refetch()
        }}
        name='Spotify v1 player'
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
