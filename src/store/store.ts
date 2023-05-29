import savedPlaylistReducer from '@/slices/savedPlaylisSlice'
import topPlayedReducer from '@/slices/topTrackSlice'
import trackReducer from '@/slices/trackSlice'
import { configureStore } from '@reduxjs/toolkit'

export const myStore = configureStore({
  reducer: {
    track: trackReducer,
    topPlayedTrack: topPlayedReducer,
    savedPlaylist: savedPlaylistReducer,
  },
})

export type RootState = ReturnType<typeof myStore.getState>

export type AppDispatch = typeof myStore.dispatch
