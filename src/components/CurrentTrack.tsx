/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api } from '@/utils/api'
import SpotifyPlayer from 'react-spotify-web-playback'

const CurrentTrack = () => {
  const { data: tokenData } = api.main.getToken.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: 10 * 1000,
    refetchIntervalInBackground: true,
  })
  const { data: currentTrackData } = api.main.getUserCurrentlyPlaying.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
    }
  )
  if (!currentTrackData || !currentTrackData.is_playing) return null
  return (
    <div className='absolute bottom-0 z-10 h-28 w-full border-t border-t-zinc-800 bg-neutral-900 px-5 text-white md:h-32'>
      <div className='flex h-full w-full flex-1 items-center justify-center p-3'>
        <SpotifyPlayer
          token={tokenData.access_token}
          name='Spotify v1 player'
          magnifySliderOnHover={true}
          showSaveIcon={true}
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
  )
}

export default CurrentTrack
