import React from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const { user, isOwner, setShowHotelReg } = useAppContext()

  return (
    <div className='flex flex-col min-h-screen'>
        <Navbar />
        <div className='flex h-full'>
            <Sidebar />
            <div className='flex-1'>
                {!user ? (
                    <div className='flex flex-col items-center justify-center h-96 gap-4 text-gray-500'>
                        <p>Please login to access the owner dashboard.</p>
                    </div>
                ) : !isOwner ? (
                    <div className='flex flex-col items-center justify-center h-96 gap-4 text-gray-500'>
                        <p>You haven't registered a hotel yet.</p>
                        <button
                            onClick={() => setShowHotelReg(true)}
                            className='bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all cursor-pointer'
                        >
                            Register your hotel
                        </button>
                    </div>
                ) : (
                    <Outlet />
                )}
            </div>
        </div>
    </div>
  )
}

export default Layout
