import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

export type TrackState = {
  trackUri: string
  playState: boolean
  trackPosition: number
  type: 'playlist' | 'track'
}

const initState: TrackState = {
  trackUri: '',
  playState: false,
  trackPosition: 0,
  type: 'track',
}

export const trackSlice = createSlice({
  name: 'Track',
  initialState: initState,
  reducers: {
    togglePlayTrack: (state, action: PayloadAction<TrackState>) => {
      state.playState = action.payload.playState
      state.trackPosition = action.payload.trackPosition
      state.trackUri = action.payload.trackUri
      state.type = action.payload.type
    },
  },
})

export const { togglePlayTrack } = trackSlice.actions

export default trackSlice.reducer
