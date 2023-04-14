import { Clock2Icon } from 'lucide-react'
import { Fragment, type FC } from 'react'

const TableHead: FC = () => {
  const fakeData: Array<{
    label?: string
    Icon?: JSX.Element
  }> = [
    { label: '#' },
    { label: 'Title' },
    { label: 'Album' },
    { label: 'Date added' },
    { Icon: <Clock2Icon /> },
  ]
  return (
    <thead className='sticky top-0 z-20'>
      <tr>
        {fakeData.map(({ Icon, label }, idx) => (
          <Fragment key={idx}>
            <th>
              <div className='flex flex-1 flex-nowrap items-center gap-x-2'>
                <span className='text-sm font-medium normal-case text-base-content'>
                  {label || ''}
                  {Icon}
                </span>
              </div>
            </th>
          </Fragment>
        ))}
      </tr>
    </thead>
  )
}

export default TableHead
