import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import assets from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {
    const { axios, authHeaders, user } = useAppContext()

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [payingId, setPayingId] = useState(null)

    const fetchBookings = async () => {
        if (!user) {
            setBookings([])
            setLoading(false)
            return
        }
        try {
            setLoading(true)
            const config = await authHeaders()
            const { data } = await axios.get('/api/bookings/user', config)
            if (data.success) setBookings(data.bookings)
        } catch (error) {
            toast.error('Could not load your bookings')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookings()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const handlePayNow = async (bookingId) => {
        try {
            setPayingId(bookingId)
            const config = await authHeaders()
            const { data } = await axios.patch(`/api/bookings/${bookingId}/pay`, {}, config)
            if (data.success) {
                toast.success('Payment confirmed')
                setBookings((prev) =>
                    prev.map((b) => (b._id === bookingId ? { ...b, isPaid: true } : b))
                )
            }
        } catch (error) {
            toast.error('Payment failed')
        } finally {
            setPayingId(null)
        }
    }

    return (

        <div className='py-28 md:py-32 px-4 md:px-16 lg:px-24 xl:px-32 bg-gray-50 min-h-screen'>

            {/* Heading */}
            <Title
                title='My Bookings'
                subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks'
                align='left'
            />

            {/* Table */}
            <div className='w-full mt-10'>

                {!user ? (
                    <p className='text-gray-500'>Please login to view your bookings.</p>
                ) : loading ? (
                    <p className='text-gray-500'>Loading your bookings...</p>
                ) : bookings.length === 0 ? (
                    <p className='text-gray-500'>You don't have any bookings yet.</p>
                ) : (
                <>
                {/* Table Header */}
                <div className='hidden md:grid grid-cols-[3fr_2fr_1fr] pb-4 border-b border-gray-300 text-sm font-semibold text-gray-700'>

                    <p>Hotels</p>
                    <p>Date & Timings</p>
                    <p>Payment</p>

                </div>

                {/* Booking Rows */}
                {bookings.map((booking) => (

                    <div
                        key={booking._id}
                        className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] gap-8 py-7 border-b border-gray-300'
                    >

                        {/* Hotel Details */}
                        <div className='flex flex-col md:flex-row gap-4'>

                            {/* Image */}
                            <img
                                src={booking.room.images[0]}
                                alt='hotel-img'
                                className='w-full md:w-44 h-32 object-cover rounded-lg shadow'
                            />

                            {/* Details */}
                            <div className='flex flex-col justify-center'>

                                {/* Hotel Name */}
                                <h2 className='text-2xl font-playfair text-gray-800'>

                                    {booking.hotel.name}

                                    <span className='text-sm text-gray-500 ml-1'>
                                        ({booking.room.roomType})
                                    </span>

                                </h2>

                                {/* Address */}
                                <div className='flex items-center gap-1 mt-1 text-sm text-gray-500'>

                                    <img
                                        src={assets.locationIcon}
                                        alt='location-icon'
                                        className='w-4'
                                    />

                                    <p>{booking.hotel.address}</p>

                                </div>

                                {/* Guests */}
                                <div className='flex items-center gap-1 mt-1 text-sm text-gray-500'>

                                    <img
                                        src={assets.guestsIcon}
                                        alt='guest-icon'
                                        className='w-4'
                                    />

                                    <p>Guests : {booking.guests}</p>

                                </div>

                                {/* Price */}
                                <p className='mt-2 text-lg font-semibold text-gray-800'>
                                    Total: ${booking.totalPrice}
                                </p>

                            </div>

                        </div>

                        {/* Date & Timing */}
                        <div className='flex flex-col md:flex-row gap-6 justify-start md:items-center text-sm text-gray-600'>

                            {/* Check In */}
                            <div>

                                <p className='font-medium text-gray-800'>
                                    Check-In:
                                </p>

                                <p className='mt-1'>
                                    {new Date(
                                        booking.checkInDate
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>

                            </div>

                            {/* Check Out */}
                            <div>

                                <p className='font-medium text-gray-800'>
                                    Check-Out:
                                </p>

                                <p className='mt-1'>
                                    {new Date(
                                        booking.checkOutDate
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>

                            </div>

                        </div>

                        {/* Payment */}
                        <div className='flex flex-col justify-center items-start gap-3'>

                            {/* Status */}
                            <div className='flex items-center gap-2'>

                                <div
                                    className={`w-2.5 h-2.5 rounded-full
                                    
                                    ${booking.isPaid
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                        }`}
                                />

                                <p
                                    className={`text-sm font-medium
                                    
                                    ${booking.isPaid
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                        }`}
                                >
                                    {booking.isPaid ? 'Paid' : 'Unpaid'}
                                </p>

                            </div>

                            {/* Pay Button */}
                            {!booking.isPaid && (

                                <button
                                    onClick={() => handlePayNow(booking._id)}
                                    disabled={payingId === booking._id}
                                    className='border border-gray-400 rounded-full px-5 py-1.5 text-sm hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-60'
                                >
                                    {payingId === booking._id ? 'Processing...' : 'Pay now'}
                                </button>

                            )}

                        </div>

                    </div>

                ))}
                </>
                )}

            </div>

        </div>
    )
}

export default MyBookings
