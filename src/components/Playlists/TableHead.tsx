import { cn } from '@/utils/cn'
import { Clock2Icon, TriangleIcon } from 'lucide-react'
import { Fragment } from 'react'

const TableHead: FC = () => {
  const fakeData: Array<{
    label: string | (new () => JSX.Element)
    isSorted?: boolean
  }> = [
    { label: '#' },
    { label: 'Title', isSorted: false },
    { label: 'Album', isSorted: false },
    { label: 'Date added', isSorted: true },
    { label: <Clock2Icon />, isSorted: false },
  ]
  return (
    <thead className='sticky top-0 z-20'>
      <tr>
        {fakeData.map((data, idx) => (
          <Fragment key={idx}>
            <th>
              <div className='flex flex-1 flex-nowrap items-center gap-x-2'>
                <span
                  className={cn(
                    'text-sm font-medium normal-case ',
                    data.isSorted
                      ? 'text-base-content'
                      : 'text-base-content/50  hover:text-base-content'
                  )}
                >
                  {data.label}
                </span>
                {data.isSorted && (
                  <TriangleIcon className='h-3 w-3 fill-green-500 stroke-transparent' />
                )}
              </div>
            </th>
          </Fragment>
        ))}
      </tr>
    </thead>
  )
}

export default TableHead
