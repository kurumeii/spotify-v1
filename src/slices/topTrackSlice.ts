import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

export type TopPlayedState = {
  trackId: string | string[]
}

export const topPlayedSlice = createSlice({
  name: 'TopPlayed',
  initialState: {
    trackId: '',
  },
  reducers: {
    setTopPlayed: (
      state: TopPlayedState,
      action: PayloadAction<TopPlayedState>
    ) => {
      state.trackId = action.payload.trackId
    },
  },
})

export const { setTopPlayed } = topPlayedSlice.actions
export default topPlayedSlice.reducer
