import { configureStore } from '@reduxjs/toolkit'
import trackReducer from '@/slices/trackSlice'
import topPlayedReducer from '@/slices/topTrackSlice'
export const myStore = configureStore({
  reducer: {
    track: trackReducer,
    topPlayedTrack: topPlayedReducer,
  },
})

export type RootState = ReturnType<typeof myStore.getState>

export type AppDispatch = typeof myStore.dispatch
