import React, { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StarRating from '../components/StarRating'
import assets from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const AllRooms = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { rooms, roomsLoading, fetchRooms } = useAppContext();

    const [selectedAmenities, setSelectedAmenities] = React.useState([]);
    const [selectedRoomTypes, setSelectedRoomTypes] = React.useState([]);
    const [minPrice, setMinPrice] = React.useState('');
    const [maxPrice, setMaxPrice] = React.useState('');

    // Destination typed into the Hero search box, carried over via ?destination=
    const destination = searchParams.get('destination') || '';

    const amenityOptions = [
        'Free WiFi',
        'Free Breakfast',
        'Room Service',
        'Mountain View',
        'Pool Access'
    ];

    const roomTypeOptions = [
        'Single Bed',
        'Double Bed',
        'Luxury Suite',
        'Family Suite'
    ];

    // Re-fetch whenever someone lands here with a fresh destination
    // (e.g. from the Hero search). Falls back to the full room list.
    useEffect(() => {
        fetchRooms(destination ? { search: destination } : {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [destination]);

    const toggleAmenity = (item) => {
        setSelectedAmenities((prev) =>
            prev.includes(item)
                ? prev.filter((a) => a !== item)
                : [...prev, item]
        );
    };

    const toggleRoomType = (item) => {
        setSelectedRoomTypes((prev) =>
            prev.includes(item)
                ? prev.filter((a) => a !== item)
                : [...prev, item]
        );
    };

    const clearFilters = () => {
        setSelectedAmenities([]);
        setSelectedRoomTypes([]);
        setMinPrice('');
        setMaxPrice('');
    };

    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            const matchesAmenities =
                selectedAmenities.length === 0 ||
                selectedAmenities.every((item) =>
                    room.amenities.includes(item)
                );

            const matchesRoomType =
                selectedRoomTypes.length === 0 ||
                selectedRoomTypes.includes(room.roomType);

            const matchesMinPrice =
                minPrice === '' ||
                room.pricePerNight >= Number(minPrice);

            const matchesMaxPrice =
                maxPrice === '' ||
                room.pricePerNight <= Number(maxPrice);

            return (
                matchesAmenities &&
                matchesRoomType &&
                matchesMinPrice &&
                matchesMaxPrice
            );
        });
    }, [rooms, selectedAmenities, selectedRoomTypes, minPrice, maxPrice]);

    return (
    <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 2xl:px-40'>

        {/* Heading */}
        <div className='flex flex-col items-start text-left mb-10'>
            <h1 className='font-playfair text-4xl md:text-[40px]'>
                Hotel Rooms
            </h1>

            <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-4xl'>
                Take advantage of our limited-time offers and special packages
                to enhance your stay and create unforgettable memories.
                {destination && (
                    <span className='block mt-1 text-gray-700 font-medium'>
                        Showing results for "{destination}"
                    </span>
                )}
            </p>
        </div>

        {/* Main Layout */}
        <div className='flex flex-col lg:flex-row gap-10 items-start'>

            {/* Rooms Section */}
            <div className='flex-1 flex flex-col gap-10 w-full'>

                {roomsLoading ? (
                    <p className='text-gray-500'>Loading rooms...</p>
                ) : filteredRooms.length === 0 ? (
                    <p className='text-gray-500'>No rooms match your filters.</p>
                ) : (
                    filteredRooms.map((room) => (

                    <div
                        key={room._id}
                        className='flex flex-col md:flex-row gap-6 w-full bg-white rounded-xl overflow-hidden shadow-lg p-4'
                    >

                        {/* Room Image */}
                        <img
                            onClick={() => {
                                navigate(`/rooms/${room._id}`)
                                scrollTo(0, 0)
                            }}
                            src={room.images[0]}
                            alt="hotel-img"
                            title="View Room Details"
                            className='w-full md:w-[320px] h-[220px] object-cover cursor-pointer rounded-xl'
                        />

                        {/* Room Details */}
                        <div className='flex flex-col justify-between flex-1'>

                            <div>

                                <p className='text-gray-500 text-sm'>
                                    {room.hotel.city}
                                </p>

                                <p
                                    onClick={() => {
                                        navigate(`/rooms/${room._id}`)
                                        scrollTo(0, 0)
                                    }}
                                    className='text-gray-800 text-3xl font-playfair cursor-pointer mt-1'
                                >
                                    {room.hotel.name}
                                </p>

                                <div className='flex items-center mt-2'>
                                    <StarRating />
                                    <p className='ml-2 text-sm text-gray-600'>
                                        200+ reviews
                                    </p>
                                </div>

                                <div className='flex items-center gap-1 text-gray-500 mt-3 text-sm'>
                                    <img
                                        src={assets.locationIcon}
                                        alt="location icon"
                                        className='w-4'
                                    />

                                    <span>{room.hotel.address}</span>
                                </div>

                                <div className='flex items-center gap-2 mt-4 flex-wrap'>
                                    {room.amenities.map((item, index) => (
                                        <span
                                            key={index}
                                            className='text-xs px-3 py-1 bg-gray-100 rounded-full'
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Price + Button */}
                            <div className='flex items-center justify-between mt-6'>

                                <p className='text-xl font-semibold text-gray-800'>
                                    ${room.pricePerNight}
                                    <span className='text-sm text-gray-500 font-normal'>
                                        /night
                                    </span>
                                </p>

                                <button
                                    onClick={() => {
                                        navigate(`/rooms/${room._id}`)
                                        scrollTo(0, 0)
                                    }}
                                    className='px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all cursor-pointer'
                                >
                                    View Details
                                </button>

                            </div>

                        </div>
                    </div>
                )))}
            </div>

            {/* Filters Sidebar */}
            <div className='w-full lg:w-80 bg-white border border-gray-300 rounded-xl p-5 shadow-sm sticky top-28'>

                <div className='flex items-center justify-between border-b pb-3'>
                    <p className='text-lg font-semibold text-gray-800'>
                        Filters
                    </p>

                    <button
                        onClick={clearFilters}
                        className='text-sm text-blue-500 hover:underline'
                    >
                        Clear All
                    </button>
                </div>

                <div className='mt-6 flex flex-col gap-6'>

                    {/* Price Range */}
                    <div>
                        <p className='font-medium text-gray-700 mb-3'>
                            Price Range
                        </p>

                        <div className='flex items-center gap-3'>

                            <input
                                type='number'
                                placeholder='Min'
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none'
                            />

                            <input
                                type='number'
                                placeholder='Max'
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none'
                            />
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <p className='font-medium text-gray-700 mb-3'>
                            Amenities
                        </p>

                        <div className='flex flex-col gap-2 text-sm'>

                            {amenityOptions.map((item, index) => (
                                <label
                                    key={index}
                                    className='flex items-center gap-2 cursor-pointer'
                                >
                                    <input
                                        type='checkbox'
                                        checked={selectedAmenities.includes(item)}
                                        onChange={() => toggleAmenity(item)}
                                    />

                                    {item}
                                </label>
                            ))}

                        </div>
                    </div>

                    {/* Room Type */}
                    <div>
                        <p className='font-medium text-gray-700 mb-3'>
                            Room Type
                        </p>

                        <div className='flex flex-col gap-2 text-sm'>

                            {roomTypeOptions.map((item, index) => (
                                <label
                                    key={index}
                                    className='flex items-center gap-2 cursor-pointer'
                                >
                                    <input
                                        type='checkbox'
                                        checked={selectedRoomTypes.includes(item)}
                                        onChange={() => toggleRoomType(item)}
                                    />

                                    {item}
                                </label>
                            ))}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
)
}

export default AllRooms
