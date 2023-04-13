import { useState } from 'react'

type TrackState = {
  playState: boolean
  trackId?: string
  position?: number
}

const initValue: TrackState = {
  playState: false,
  trackId: '',
  position: 0,
}
const useTrackState = () => {
  const [trackState, setTrackState] = useState(initValue)

  return {
    ...trackState,
    togglePlayState: ({ playState, position, trackId }: TrackState) =>
      setTrackState(prev => {
        return {
          ...prev,
          playState: playState,
          position: position,
          trackId: trackId,
        }
      }),
  }
}

export default useTrackState
