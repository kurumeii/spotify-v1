import { configureStore } from '@reduxjs/toolkit'
import trackReducer from '@/slices/trackSlice'
import topPlayedReducer from '@/slices/topTrackSlice'
import savedPlaylistReducer from '@/slices/savedPlaylisSlice'
import { useDispatch } from 'react-redux'
export const myStore = configureStore({
  reducer: {
    track: trackReducer,
    topPlayedTrack: topPlayedReducer,
    savedPlaylist: savedPlaylistReducer,
  },
})

export type RootState = ReturnType<typeof myStore.getState>

type AppDispatch = typeof myStore.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
