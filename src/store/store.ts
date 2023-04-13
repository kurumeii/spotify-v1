import { configureStore } from '@reduxjs/toolkit'
import trackReducer from '@/slices/trackSlice'
export const myStore = configureStore({
  reducer: {
    track: trackReducer,
  },
})

export type RootState = ReturnType<typeof myStore.getState>

export type AppDispatch = typeof myStore.dispatch
