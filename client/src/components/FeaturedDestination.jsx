import React from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const FeaturedDestination = () => {
    const navigate = useNavigate();
    const { rooms, roomsLoading } = useAppContext();

  return (
    <div className = 'flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-12 gap-6'>

        <Title  title='Featured Destination' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.' />

        {roomsLoading ? (
            <p className='text-gray-500 mt-12'>Loading featured stays...</p>
        ) : rooms.length === 0 ? (
            <p className='text-gray-500 mt-12'>No rooms available yet.</p>
        ) : (
            <div className = 'flex flex-wrap items-center justify-center gap-6 mt-12'>
                {rooms.slice(0,4).map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />
                ))}
            </div>
        )}

        <button className='my-8 mx-auto px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'
        onClick = {() => {navigate('/rooms'); scrollTo(0,0)}} > View All Destination </button>

    </div>
  )
}

export default FeaturedDestination
