import { type LucideIcon } from 'lucide-react'
import { type ButtonHTMLAttributes, type FC } from 'react'

export type SidebarProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  Icon: LucideIcon
  label: string
  link?: string
}

const SideBarBtn: FC<SidebarProps> = ({ Icon, label, ...props }) => {
  return (
    <>
      <button
        className='flex w-full items-center gap-x-2 px-2 pt-2 opacity-80 transition-all hover:opacity-100'
        {...props}
      >
        <Icon className='h-6 w-6' />
        <span className='first-letter:uppercase'>{label}</span>
      </button>
    </>
  )
}

export default SideBarBtn
