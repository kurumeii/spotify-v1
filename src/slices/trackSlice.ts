import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

export type TrackState = {
  trackUri: string
  playState: boolean
  trackPosition: number
}

const initState: TrackState = {
  trackUri: '',
  playState: false,
  trackPosition: 0,
}

export const trackSlice = createSlice({
  name: 'Track',
  initialState: initState,
  reducers: {
    togglePlayTrack: (state, action: PayloadAction<TrackState>) => {
      state.playState = action.payload.playState
      state.trackPosition = action.payload.trackPosition
      state.trackUri = action.payload.trackUri
    },
  },
})

export const { togglePlayTrack } = trackSlice.actions

export default trackSlice.reducer
