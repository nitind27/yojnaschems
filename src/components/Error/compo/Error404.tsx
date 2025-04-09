import {FC} from 'react'
// import {Link} from 'react-router-dom'
import Image from 'next/image'
import Link from 'next/link'
import { toAbsoluteUrl } from '@/_metronic/helpers'

const Error404: FC = () => {
  return (
    <>
      {/* begin::Title */}
      <h1 className='fw-bolder fs-2hx text-gray-900 mb-4'>Oops!</h1>
      {/* end::Title */}

      {/* begin::Text */}
      <div className='fw-semibold fs-6 text-gray-500 mb-7'>Something went wrong.</div>
      {/* end::Text */}

      {/* begin::Illustration */}
      <div className='mb-3'>
        <Image
          src={'/media/email/500-error.png'}
          className='mw-100 mh-300px theme-light-show'
          alt='ok1'
          width={200}
          height={200}
        />
        <Image
          src={toAbsoluteUrl('/media/auth/500-error-dark.png')}
          className='mw-100 mh-300px theme-dark-show'
          alt='ok2'
          width={200}
          height={200}
        />
      </div>
      {/* end::Illustration */}

      {/* begin::Link */}
      <div className='mb-0'>
        <Link href={'/dashboard'} className='btn btn-sm btn-primary'>
          Return Home
        </Link>
      </div>
      {/* end::Link */}
    </>
  )
}

export {Error404}
