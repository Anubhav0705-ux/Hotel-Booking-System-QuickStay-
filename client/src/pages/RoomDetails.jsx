import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import assets, {
    facilityIcons,
    roomCommonData
} from '../assets/assets'
import StarRating from '../components/StarRating'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const RoomDetails = () => {

    const { id } = useParams()
    const { axios, user, authHeaders } = useAppContext()

    const [room, setRoom] = useState(null)
    const [loading, setLoading] = useState(true)
    const [mainImage, setMainImage] = useState(null)

    const [checkInDate, setCheckInDate] = useState('')
    const [checkOutDate, setCheckOutDate] = useState('')
    const [guests, setGuests] = useState(1)
    const [booking, setBooking] = useState(false)

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true)
                const { data } = await axios.get(`/api/rooms/${id}`)
                if (data.success) {
                    setRoom(data.room)
                    setMainImage(data.room.images[0])
                }
            } catch (error) {
                toast.error('Could not load this room')
            } finally {
                setLoading(false)
            }
        }

        fetchRoom()
    }, [id, axios])

    const handleBooking = async (e) => {
        e.preventDefault()

        if (!user) {
            toast.error('Please login to book a room')
            return
        }

        if (new Date(checkOutDate) <= new Date(checkInDate)) {
            toast.error('Check-out date must be after check-in date')
            return
        }

        try {
            setBooking(true)
            const config = await authHeaders()
            const { data } = await axios.post(
                '/api/bookings',
                {
                    roomId: room._id,
                    checkInDate,
                    checkOutDate,
                    guests,
                    paymentMethod: 'Pay At Hotel',
                },
                config
            )

            if (data.success) {
                toast.success('Booking confirmed! Check "My Bookings" for details.')
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Booking failed')
        } finally {
            setBooking(false)
        }
    }

    if (loading) {
        return (
            <div className='py-32 text-center text-gray-500'>
                Loading room details...
            </div>
        )
    }

    return room && (

        <div className='py-28 md:py-32 px-4 md:px-16 lg:px-24 xl:px-32 bg-gray-50 min-h-screen'>

            {/* Top Section */}
            <div>

                <h1 className='text-3xl md:text-5xl font-playfair font-bold text-gray-800'>
                    {room.hotel.name}

                    <span className='text-lg md:text-2xl font-medium ml-2 text-gray-600'>
                        ({room.roomType})
                    </span>
                </h1>

                <p className='text-xs font-medium py-2 px-4 bg-green-100 text-green-700 rounded-full w-max mt-4'>
                    20% OFF
                </p>

                {/* Rating */}
                <div className='flex items-center gap-2 mt-5'>

                    <StarRating />

                    <p className='text-gray-600 text-sm'>
                        200+ Reviews
                    </p>
                </div>

                {/* Location */}
                <div className='flex items-center gap-2 mt-4 text-gray-500'>

                    <img
                        src={assets.locationIcon}
                        alt='location'
                        className='w-4'
                    />

                    <span className='text-sm'>
                        {room.hotel.address}
                    </span>
                </div>
            </div>

            {/* Images Section */}
            <div className='flex flex-col lg:flex-row gap-6 mt-10'>

                {/* Main Image */}
                <div className='lg:w-1/2 w-full'>

                    <img
                        src={mainImage}
                        alt='room'
                        className='w-full h-[420px] object-cover rounded-2xl shadow-lg'
                    />
                </div>

                {/* Side Images */}
                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>

                    {room.images.map((image, index) => (

                        <img
                            key={index}
                            src={image}
                            alt={`room-${index}`}
                            onClick={() => setMainImage(image)}
                            className={`h-[200px] w-full object-cover rounded-2xl cursor-pointer shadow-md transition-all duration-200
                            
                            ${mainImage === image
                                    ? 'outline outline-4 outline-orange-400'
                                    : 'hover:scale-[1.02]'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Room Highlights */}
            <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between mt-14 gap-8'>

                <div>

                    <h2 className='text-3xl md:text-4xl font-playfair text-gray-800'>
                        Experience Luxury Like Never Before
                    </h2>

                    {/* Amenities */}
                    <div className='flex flex-wrap gap-4 mt-6'>

                        {room.amenities.map((item, index) => (

                            <div
                                key={index}
                                className='flex items-center gap-2 px-4 py-3 rounded-xl bg-white shadow-sm border border-gray-100'
                            >

                                <img
                                    src={facilityIcons[item]}
                                    alt={item}
                                    className='w-5'
                                />

                                <p className='text-sm text-gray-700'>
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div className='bg-white shadow-md rounded-2xl px-8 py-6'>

                    <p className='text-3xl font-bold text-gray-800'>
                        ${room.pricePerNight}

                        <span className='text-lg font-normal text-gray-500'>
                            /night
                        </span>
                    </p>
                </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBooking} className='flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 bg-white shadow-xl p-8 rounded-2xl mt-16 max-w-7xl'>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full'>

                    {/* Check In */}
                    <div className='flex flex-col'>

                        <label
                            htmlFor='checkInDate'
                            className='font-medium text-gray-700'
                        >
                            Check-In Date
                        </label>

                        <input
                            type='date'
                            id='checkInDate'
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            className='w-full rounded-lg border border-gray-300 px-4 py-3 mt-2 outline-none focus:border-blue-500'
                            required
                        />
                    </div>

                    {/* Check Out */}
                    <div className='flex flex-col'>

                        <label
                            htmlFor='checkOutDate'
                            className='font-medium text-gray-700'
                        >
                            Check-Out Date
                        </label>

                        <input
                            type='date'
                            id='checkOutDate'
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            className='w-full rounded-lg border border-gray-300 px-4 py-3 mt-2 outline-none focus:border-blue-500'
                            required
                        />
                    </div>

                    {/* Guests */}
                    <div className='flex flex-col'>

                        <label
                            htmlFor='guests'
                            className='font-medium text-gray-700'
                        >
                            Number of Guests
                        </label>

                        <input
                            type='number'
                            id='guests'
                            placeholder='Enter Guests'
                            min='1'
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className='w-full rounded-lg border border-gray-300 px-4 py-3 mt-2 outline-none focus:border-blue-500'
                            required
                        />
                    </div>
                </div>

                {/* Button */}
                <button
                    type='submit'
                    disabled={booking}
                    className='bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white rounded-xl px-10 py-4 text-base font-medium cursor-pointer w-full lg:w-auto disabled:opacity-60'
                >
                    {booking ? 'Booking...' : 'Check Availability'}
                </button>
            </form>

            {/* Common data */}
            <div className='mt-20 space-y-6'>

                {roomCommonData.map((item, index) => (

                    <div
                        key={index}
                        className='flex items-start gap-4'
                    >

                        <img
                            src={item.icon}
                            alt={`${item.title}-icon`}
                            className='w-6 mt-1'
                        />

                        <div>

                            <p className='text-base font-medium text-gray-800'>
                                {item.title}
                            </p>

                            <p className='text-sm text-gray-500 mt-1'>
                                {item.description}
                            </p>

                        </div>
                    </div>
                ))}
            </div>

            <div className='max-w-3xl border-y border-gray-300 my-16 py-10 text-gray-500 leading-7'>
                <p>Guests will be allocated on the ground floor according to availability. You get a comfortable Two bedroom apartment has a true city feeling. The price quoted is for two guest, at the guest slot please mark the number of guests to get the exact price for groups. The Guests will be allocated ground floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.</p>
            </div>

            {/* Hosted By */}
            <div className='flex flex-col items-start gap-4'>
                <div className='flex gap-4 items-center'>
                    <img src = {room.hotel.owner?.image || assets.userIcon} alt = "Host" className = 'w-16 h-16 rounded-full' />
                </div>
                <div>
                    <p className = 'text-lg font-medium'>Hosted by {room.hotel.name}</p>
                    <div className='flex items-center mt-1'>
                        <StarRating />
                        <p className = 'text-sm text-gray-600'>200+ Reviews</p>
                    </div>
                </div>
                <button className='px-6 py-3 mt-4 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all cursor-pointer'> Contact Now</button>
            </div>

        </div>
    )
}

export default RoomDetails
