'use client'
import {useEffect} from 'react'
import {useThemeMode} from '@/_metronic/partials/layout/theme-mode/ThemeModeProvider'
import { toAbsoluteUrl } from '@/_metronic/helpers'
import { Error404 } from './compo/Error404'


const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat']
const ErrorsLayout = () => {
  const {mode} = useThemeMode()
  useEffect(() => {
    BODY_CLASSES.forEach((c) => document.body.classList.add(c))
    document.body.style.backgroundImage =
      mode === 'dark'
         ? `url(${toAbsoluteUrl('media/email/bg7-dark.jpg')})`
        : `url(${toAbsoluteUrl('media/email/bg7.jpg')})`
    return () => {
      BODY_CLASSES.forEach((c) => document.body.classList.remove(c))
      document.body.style.backgroundImage = 'none'
    }
  }, [mode])

  return (
    <div className='d-flex flex-column ok flex-root'>
      <div className='d-flex flex-column  flex-center flex-column-fluid'>
        <div className='d-flex flex-column  flex-center text-center p-10'>
          <div className='card card-flush  w-lg-650px py-5'>
            <div className='card-body py-15 py-lg-20'>
              <Error404/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {ErrorsLayout}
