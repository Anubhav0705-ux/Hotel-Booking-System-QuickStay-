import React, { useEffect, useState } from 'react'
import assets from '../../assets/assets'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ListRoom = () => {
    const { axios, authHeaders } = useAppContext()

    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMyRooms = async () => {
        try {
            setLoading(true)
            const config = await authHeaders()
            const { data } = await axios.get('/api/rooms/owner/mine', config)
            if (data.success) setRooms(data.rooms)
        } catch (error) {
            toast.error('Could not load your rooms')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMyRooms()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this room?'
        )

        if (!confirmDelete) return

        try {
            const config = await authHeaders()
            const { data } = await axios.delete(`/api/rooms/${id}`, config)
            if (data.success) {
                toast.success('Room deleted')
                setRooms((prev) => prev.filter((room) => room._id !== id))
            }
        } catch (error) {
            toast.error('Could not delete room')
        }
    }

    return (

        <div className='w-full min-h-screen bg-gray-50 px-6 md:px-10 py-8'>

            {/* Page Title */}
            <Title
                align='left'
                title='Room Listings'
                subTitle='Manage all your hotel rooms, update pricing, amenities and availability with ease.'
            />

            {loading ? (
                <p className='text-gray-500 mt-8'>Loading your rooms...</p>
            ) : rooms.length === 0 ? (
                <p className='text-gray-500 mt-8'>You haven't added any rooms yet.</p>
            ) : (

            <div className='mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden'>

                {/* Desktop Table */}
                <div className='hidden md:block overflow-x-auto'>

                    <table className='w-full border-collapse'>

                        <thead className='bg-gray-100 text-gray-700 text-sm uppercase tracking-wide'>

                            <tr>

                                <th className='px-6 py-4 text-left font-semibold'>
                                    Room
                                </th>

                                <th className='px-6 py-4 text-left font-semibold'>
                                    Room Type
                                </th>

                                <th className='px-6 py-4 text-left font-semibold'>
                                    Price
                                </th>

                                <th className='px-6 py-4 text-left font-semibold'>
                                    Amenities
                                </th>

                                <th className='px-6 py-4 text-center font-semibold'>
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {rooms.map((room, index) => (

                                <tr
                                    key={index}
                                    className='border-t border-gray-200 hover:bg-gray-50 transition-all'
                                >

                                    {/* Room Image + Name */}
                                    <td className='px-6 py-5'>

                                        <div className='flex items-center gap-4'>

                                            <img
                                                src={room.images[0] || assets.uploadArea}
                                                alt='room'
                                                className='w-24 h-16 rounded-lg object-cover'
                                            />

                                            <div>

                                                <p className='font-semibold text-gray-800'>
                                                    {room.hotel.name}
                                                </p>

                                                <p className='text-sm text-gray-500'>
                                                    {room.hotel.city}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Room Type */}
                                    <td className='px-6 py-5 text-gray-700'>
                                        {room.roomType}
                                    </td>

                                    {/* Price */}
                                    <td className='px-6 py-5 font-medium text-gray-800'>
                                        ${room.pricePerNight}/night
                                    </td>

                                    {/* Amenities */}
                                    <td className='px-6 py-5'>

                                        <div className='flex flex-wrap gap-2'>

                                            {room.amenities
                                                .slice(0, 3)
                                                .map((item, i) => (

                                                    <span
                                                        key={i}
                                                        className='text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600'
                                                    >
                                                        {item}
                                                    </span>
                                                ))}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className='px-6 py-5'>

                                        <div className='flex items-center justify-center gap-3'>

                                            {/* Delete */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(room._id)
                                                }
                                                className='bg-red-100 hover:bg-red-200 transition-all p-2 rounded-lg cursor-pointer'
                                            >

                                                <img
                                                    src={assets.closeIcon}
                                                    alt='delete'
                                                    className='w-5'
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className='md:hidden flex flex-col gap-4 p-4'>

                    {rooms.map((room, index) => (

                        <div
                            key={index}
                            className='border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm'
                        >

                            <img
                                src={room.images[0] || assets.uploadArea}
                                alt='room'
                                className='w-full h-52 object-cover'
                            />

                            <div className='p-4'>

                                <div className='flex items-start justify-between gap-3'>

                                    <div>

                                        <h2 className='font-semibold text-lg text-gray-800'>
                                            {room.hotel.name}
                                        </h2>

                                        <p className='text-sm text-gray-500'>
                                            {room.hotel.city}
                                        </p>
                                    </div>

                                    <p className='font-semibold text-gray-800'>
                                        ${room.pricePerNight}
                                    </p>
                                </div>

                                <p className='text-sm text-gray-600 mt-3'>
                                    {room.roomType}
                                </p>

                                {/* Amenities */}
                                <div className='flex flex-wrap gap-2 mt-4'>

                                    {room.amenities
                                        .slice(0, 3)
                                        .map((item, i) => (

                                            <span
                                                key={i}
                                                className='text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600'
                                            >
                                                {item}
                                            </span>
                                        ))}
                                </div>

                                {/* Actions */}
                                <div className='flex items-center gap-3 mt-5'>

                                    <button
                                        onClick={() =>
                                            handleDelete(room._id)
                                        }
                                        className='flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition-all cursor-pointer'
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}
        </div>
    )
}

export default ListRoom
