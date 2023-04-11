import { api } from '@/utils/api'
import SpotifyPlayer from 'react-spotify-web-playback'

const CurrentTrack = () => {
  const { data: currentTrackData, refetch } =
    api.main.getUserCurrentlyPlaying.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    })

  if (!currentTrackData) return null
  return (
    <>
      {currentTrackData.trackDetail !== null && (
        <div className='absolute bottom-0 z-10 h-28 w-full border-t border-t-zinc-800 bg-neutral-900 px-5 text-white md:h-32'>
          <div className='flex h-full w-full flex-1 items-center justify-center p-3'>
            <SpotifyPlayer
              token={currentTrackData.accessToken ?? ''}
              uris={
                currentTrackData.is_playing && currentTrackData.trackDetail.uri
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
          </div>
        </div>
      )}
    </>
  )
}

export default CurrentTrack
