import { setSavedPlaylist } from '@/slices/savedPlaylisSlice'
import { useAppDispatch } from '@/store/store'
import { api } from '@/utils/api'
import {
  HomeIcon,
  LibraryIcon,
  ListPlusIcon,
  SearchIcon,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import {
  useCallback,
  useState,
  type ButtonHTMLAttributes,
  type FC,
} from 'react'
import SpotifyLogo from './SpotifyLogo'
import UserPlaylists from './UserPlaylists'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/Dialog'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { Separator } from './ui/Separator'

type SidebarProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  Icon: LucideIcon
  label: string
  link?: string
}

const SideBarBtn: FC<SidebarProps> = ({ Icon, label, link, ...props }) => {
  return (
    <>
      <Link href={link ?? '/#'} replace>
        <button
          className='flex w-full items-center gap-x-2 px-2 pt-2 opacity-80 transition-all   hover:opacity-100'
          {...props}
        >
          <Icon className='h-6 w-6' />
          <span className='first-letter:uppercase'>{label}</span>
        </button>
      </Link>
    </>
  )
}

const coreFunctionBtn: Array<SidebarProps> = [
  {
    Icon: HomeIcon,
    label: 'home',
    link: '/',
  },
  {
    Icon: SearchIcon,
    label: 'search',
    link: '/search',
  },
  {
    Icon: LibraryIcon,
    label: 'Library',
  },
]

const initialFieldValue = {
  playlistName: '',
  description: '',
  isPublic: true,
}

const Sidebar: FC = () => {
  const dispatch = useAppDispatch()
  const addNewPlaylist = api.main.addNewPlaylist.useMutation()
  const getUserPlaylists = api.main.getUserPlaylists.useQuery(undefined, {
    refetchOnWindowFocus: false,
    onSuccess: data => {
      dispatch(
        setSavedPlaylist({
          playlistObj: {
            basicInfo: data.spotifyResponse.items.map(item => ({
              id: item.id,
              name: item.name,
              isPlaying: data.playlistIsPlayingHref === item.href,
            })),
          },
        })
      )
    },
  })

  const [fields, setFields] = useState(initialFieldValue)
  const [isOpen, setOpen] = useState(false)

  const handleCreateNewPlaylist = useCallback(async () => {
    await addNewPlaylist.mutateAsync({
      ...fields,
    })
    void getUserPlaylists.refetch()
    setFields(initialFieldValue)
    setOpen(false)
  }, [addNewPlaylist, fields, getUserPlaylists])

  return (
    <div className='flex h-full w-full flex-col space-y-4 '>
      <Link href='/'>
        <SpotifyLogo />
      </Link>
      {coreFunctionBtn.map(({ ...props }, id) => (
        <SideBarBtn key={id} {...props} />
      ))}
      <div className='pt-4'>
        <SideBarBtn
          Icon={ListPlusIcon}
          label='Create new library'
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
                <Input
                  name='playlist_name'
                  value={fields.playlistName}
                  placeholder='My awesome playlist'
                  className='col-span-3 '
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
                  name='description'
                  value={fields.description}
                  placeholder='(Optional) Description about your playlist'
                  className='textarea col-span-3 row-span-3 resize-none border-neutral-800 bg-transparent'
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
                  name='is_public'
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
      <Separator />
      {/* Get playlist from current users */}
      <UserPlaylists refetchData={getUserPlaylists.refetch} />
    </div>
  )
}

export default Sidebar
