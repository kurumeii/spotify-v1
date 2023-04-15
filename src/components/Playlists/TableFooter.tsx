import { cn } from '@/utils/cn'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
} from 'lucide-react'
import { type Dispatch, type FC, type SetStateAction } from 'react'

type Props = {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  totalPages: number
}

const TableFooter: FC<Props> = ({ page, setPage, totalPages }) => {
  return (
    <tfoot>
      {totalPages !== 0 && (
        <tr>
          <td colSpan={5}>
            <div className='flex items-center justify-center'>
              <div className='btn-group '>
                {/* To very first page */}
                <button
                  className={cn(
                    'btn',
                    page === 1 ? 'btn-success' : 'btn-ghost '
                  )}
                  onClick={() => setPage(1)}
                >
                  <ChevronFirstIcon className='mx-2 ' />
                  First
                </button>
                {/* If not the first page, previous page will fetch 10 previous items  */}
                {page !== 1 && (
                  <button
                    className='btn-ghost btn'
                    title='Previous page'
                    onClick={() => setPage(prev => prev - 1)}
                  >
                    <ArrowLeftIcon />
                  </button>
                )}
                <select
                  className='select-ghost select mx-2'
                  value={page}
                  onChange={e => setPage(Number(e.target.value))}
                >
                  {[...Array(totalPages).keys()].map(v => (
                    <option key={v} value={v + 1}>
                      {v + 1}
                    </option>
                  ))}
                </select>
                {/* If not the last page, next page will fetch 10 next items  */}
                {page !== totalPages && (
                  <button
                    className='btn-ghost btn'
                    title='Next page'
                    onClick={() => setPage(prev => prev + 1)}
                  >
                    <ArrowRightIcon />
                  </button>
                )}
                {/* To very last page */}
                <button
                  className={cn(
                    'btn',
                    page === totalPages ? 'btn-success' : 'btn-ghost '
                  )}
                  onClick={() => setPage(totalPages)}
                >
                  <ChevronLastIcon className='mx-2 ' />
                  Last
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </tfoot>
  )
}

export default TableFooter
