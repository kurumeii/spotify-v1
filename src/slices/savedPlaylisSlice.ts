import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

export type PlaylistState = {
  playlistObj: {
    basicInfo: Array<{ id: string; name: string; isPlaying: boolean }>
    tracksInPlaylist: Array<
      Pick<SpotifyApi.PlaylistTrackResponse['items'][0], 'track'>
    >
  }
}

const initialState: PlaylistState = {
  playlistObj: {
    basicInfo: [],
    tracksInPlaylist: [],
  },
}

export const savedPlaylistSlice = createSlice({
  name: 'Playlist',
  initialState,
  reducers: {
    setSavedPlaylist: (state, action: PayloadAction<PlaylistState>) => {
      state.playlistObj.basicInfo = action.payload.playlistObj.basicInfo
      state.playlistObj.tracksInPlaylist =
        action.payload.playlistObj.tracksInPlaylist
    },
  },
})

export const { setSavedPlaylist } = savedPlaylistSlice.actions
const savedPlaylistReducer = savedPlaylistSlice.reducer
export default savedPlaylistReducer
