import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { usePlaylist } from '@/hooks/usePlaylist'
import { api } from '@/utils/api'
import { type FC, useState } from 'react'
import { Label } from '@/components/ui/Label'
import SideBarBtn from './SideBarBtn'
import { ListPlusIcon } from 'lucide-react'
const initialFieldValue = {
  playlistName: '',
  description: '',
  isPublic: true,
}

const CreateNewPlaylist: FC = () => {
  const [isOpen, setOpen] = useState(false)
  const addNewPlaylist = api.main.addNewPlaylist.useMutation()
  const getUserPlaylists = usePlaylist()
  const [fields, setFields] = useState(initialFieldValue)

  const handleCreateNewPlaylist = async () => {
    await addNewPlaylist.mutateAsync({
      ...fields,
    })
    void getUserPlaylists.refetch()
    setFields(initialFieldValue)
    setOpen(false)
  }
  return (
    <div className='pt-4'>
      <SideBarBtn
        Icon={ListPlusIcon}
        label='Create new playlist'
        onClick={() => setOpen(true)}
      />

      <Dialog
        open={isOpen}
        onOpenChange={() => {
          setOpen(prev => !prev)
          setFields(initialFieldValue)
        }}
      >
        <DialogContent onInteractOutside={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Create your new playlist</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='playlist_name'
                className='text-right text-neutral-500'
              >
                Playlist name
              </Label>
              <input
                id='playlist_name'
                value={fields.playlistName}
                placeholder='My awesome playlist'
                className='!input-bordered !input col-span-3'
                autoComplete='off'
                onChange={e =>
                  setFields(prev => ({
                    ...prev,
                    playlistName: e.target.value,
                  }))
                }
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='description'
                className='text-right text-neutral-500'
              >
                Description
              </Label>
              <textarea
                id='description'
                value={fields.description}
                placeholder='Description about your playlist'
                className='textarea-bordered textarea min-h-16 col-span-3 row-span-3 max-h-48 resize-y'
                onChange={e =>
                  setFields(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              ></textarea>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='is_public'
                className='text-right text-neutral-500'
              >
                Public
              </Label>
              <input
                id='is_public'
                type='checkbox'
                className='toggle-success toggle'
                checked={fields.isPublic}
                onChange={e =>
                  setFields(prev => ({
                    ...prev,
                    isPublic: e.target.checked,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <button
              className='btn-outline btn-success btn'
              onClick={() => void handleCreateNewPlaylist()}
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateNewPlaylist
