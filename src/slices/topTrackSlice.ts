import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

export type TopPlayedState = {
  trackId: string[]
}

const initialState: TopPlayedState = {
  trackId: [],
}

export const topPlayedSlice = createSlice({
  name: 'TopPlayed',
  initialState,
  reducers: {
    setTopPlayed: (state, action: PayloadAction<TopPlayedState>) => {
      state.trackId = action.payload.trackId
    },
  },
})

export const { setTopPlayed } = topPlayedSlice.actions
export default topPlayedSlice.reducer
