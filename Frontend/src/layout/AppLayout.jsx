import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div className='w-full mx-auto p-4 flex flex-col gap-4  '>

      <div className='bg-amber-500 p-4 text-white text-center '>
        {/* header */}
      </div>
      <div className='bg-amber-900 p-4 text-white text-center container mx-auto min-h-[90vh]'>
        <Outlet />
      </div>
      <div className='bg-amber-900 p-4 text-white text-center'>
        {/* footer */}
      </div>

    </div>
  )
}

export default AppLayout
