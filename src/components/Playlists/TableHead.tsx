import { Clock2Icon } from 'lucide-react'
import { Fragment } from 'react'

const TableHead: FC = () => {
  const fakeData: Array<{
    label: string | (new () => JSX.Element)
    isSorted?: boolean
  }> = [
    { label: '#' },
    { label: 'Title' },
    { label: 'Album' },
    { label: 'Date added' },
    { label: <Clock2Icon /> },
  ]
  return (
    <thead className='sticky top-0 z-20'>
      <tr>
        {fakeData.map((data, idx) => (
          <Fragment key={idx}>
            <th>
              <div className='flex flex-1 flex-nowrap items-center gap-x-2'>
                <span className='text-sm font-medium normal-case text-base-content'>
                  {data.label}
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
