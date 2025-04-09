
import React from 'react'
import SignInImg from '../Signinimg/Signinimg'
import Register from '@/components/auth/register/register'

const Ragister = () => {
  return (
    
    <div className="row d-flex vh-100 w-100 ">
      <div style={{backgroundColor:'#F5F8FA'}} className='col-lg-8 col-md-7 p-0 col-12  '>
        <SignInImg/>
      </div>
      <div className='col-lg-4 col-md-5 col-12 p-0 col-12 bg-white'>
      <Register />
      </div>
    </div>
  )
}

export default Ragister
