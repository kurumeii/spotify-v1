import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

export type PlaylistState = {
  playlistObj: Array<{
    id: string
    name: string
    isPlaying: boolean
  }>
}

const initialState: PlaylistState = {
  playlistObj: [],
}

export const savedPlaylistSlice = createSlice({
  name: 'Playlist',
  initialState,
  reducers: {
    setSavedPlaylist: (state, action: PayloadAction<PlaylistState>) => {
      state.playlistObj = action.payload.playlistObj
    },
  },
})

export const { setSavedPlaylist } = savedPlaylistSlice.actions
const savedPlaylistReducer = savedPlaylistSlice.reducer
export default savedPlaylistReducer
