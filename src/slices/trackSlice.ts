import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

export type TrackState = {
  playlistUri?: string
  trackUri?: string
  playState: boolean
  trackProgress: number
  trackOffset?: number
  type: 'playlist' | 'track'
}

const initState: TrackState = {
  trackUri: '',
  playlistUri: '',
  playState: false,
  trackProgress: 0,
  trackOffset: 0,
  type: 'track',
}

export const trackSlice = createSlice({
  name: 'Track',
  initialState: initState,
  reducers: {
    togglePlayTrack: (state, action: PayloadAction<TrackState>) => {
      state.playState = action.payload.playState
      state.trackProgress = action.payload.trackProgress
      state.trackUri = action.payload.trackUri
      state.type = action.payload.type
      state.playlistUri = action.payload.playlistUri
      state.trackOffset = action.payload.trackOffset
    },
  },
})

export const { togglePlayTrack } = trackSlice.actions

export default trackSlice.reducer
