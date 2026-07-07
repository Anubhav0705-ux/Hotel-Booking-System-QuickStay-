import React, { useState } from 'react'
import Title from '../../components/Title'
import assets from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddRoom = () => {
    const { axios, authHeaders } = useAppContext()
    const [submitting, setSubmitting] = useState(false)

    const [images, setImages] = useState({
        1: null,
        2: null,
        3: null,
        4: null
    })

    const [inputs, setInputs] = useState({
        roomType: '',
        pricePerNight: '',
        description: '',
        maxGuests: 1,
        amenities: {
            'Free WiFi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false
        }
    })

    const handleAmenityChange = (amenity) => {

        setInputs((prev) => ({
            ...prev,
            amenities: {
                ...prev.amenities,
                [amenity]: !prev.amenities[amenity]
            }
        }))
    }

    const resetForm = () => {
        setImages({ 1: null, 2: null, 3: null, 4: null })
        setInputs({
            roomType: '',
            pricePerNight: '',
            description: '',
            maxGuests: 1,
            amenities: {
                'Free WiFi': false,
                'Free Breakfast': false,
                'Room Service': false,
                'Mountain View': false,
                'Pool Access': false
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!inputs.roomType || !inputs.pricePerNight) {
            toast.error('Room type and price are required')
            return
        }

        const selectedAmenities = Object.keys(inputs.amenities).filter(
            (key) => inputs.amenities[key]
        )

        const formData = new FormData()
        formData.append('roomType', inputs.roomType)
        formData.append('pricePerNight', inputs.pricePerNight)
        formData.append('description', inputs.description)
        formData.append('maxGuests', inputs.maxGuests)
        formData.append('amenities', JSON.stringify(selectedAmenities))

        Object.values(images).forEach((file) => {
            if (file) formData.append('images', file)
        })

        try {
            setSubmitting(true)
            const config = await authHeaders()
            const { data } = await axios.post('/api/rooms', formData, config)

            if (data.success) {
                toast.success('Room added successfully')
                resetForm()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Could not add room')
        } finally {
            setSubmitting(false)
        }
    }

    return (

        <div className='w-full min-h-screen bg-gray-50 px-6 md:px-10 py-8'>

            <form
                onSubmit={handleSubmit}
                className='max-w-5xl'
            >

                {/* Title */}
                <Title
                    align='left'
                    title='Add Room'
                    subTitle='Fill in the details carefully and provide accurate room details, pricing, and amenities to enhance the booking experience.'
                />

                {/* Main Form */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mt-8'>

                    {/* Upload Images */}
                    <div>

                        <p className='text-lg font-semibold text-gray-800 mb-4'>
                            Upload Room Images
                        </p>

                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>

                            {Object.keys(images).map((key) => (

                                <label
                                    key={key}
                                    htmlFor={`roomImage${key}`}
                                    className='cursor-pointer'
                                >

                                    <input
                                        type='file'
                                        id={`roomImage${key}`}
                                        hidden
                                        accept='image/*'
                                        onChange={(e) =>
                                            setImages({
                                                ...images,
                                                [key]: e.target.files[0]
                                            })
                                        }
                                    />

                                    <div className='h-32 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-gray-100 hover:border-blue-400 transition-all flex items-center justify-center'>

                                        {images[key] ? (

                                            <img
                                                src={URL.createObjectURL(images[key])}
                                                alt='room'
                                                className='w-full h-full object-cover'
                                            />

                                        ) : (

                                            <div className='flex flex-col items-center text-gray-400'>

                                                <img
                                                    src={assets.uploadArea}
                                                    alt='upload'
                                                    className='w-10 opacity-70'
                                                />

                                                <p className='text-sm mt-2'>
                                                    Upload
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Room Details */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-10'>

                        {/* Room Type */}
                        <div className='flex flex-col'>

                            <label className='text-sm font-medium text-gray-700'>
                                Room Type
                            </label>

                            <select
                                value={inputs.roomType}
                                onChange={(e) =>
                                    setInputs({
                                        ...inputs,
                                        roomType: e.target.value
                                    })
                                }
                                className='mt-2 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500'
                            >
                                <option value=''>
                                    Select Room Type
                                </option>

                                <option value='Single Bed'>
                                    Single Bed
                                </option>

                                <option value='Double Bed'>
                                    Double Bed
                                </option>

                                <option value='Luxury Suite'>
                                    Luxury Suite
                                </option>

                                <option value='Family Suite'>
                                    Family Suite
                                </option>
                            </select>
                        </div>

                        {/* Price */}
                        <div className='flex flex-col'>

                            <label className='text-sm font-medium text-gray-700'>
                                Price Per Night ($)
                            </label>

                            <input
                                type='number'
                                placeholder='Enter price'
                                value={inputs.pricePerNight}
                                onChange={(e) =>
                                    setInputs({
                                        ...inputs,
                                        pricePerNight: e.target.value
                                    })
                                }
                                className='mt-2 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500'
                            />
                        </div>

                        {/* Guests */}
                        <div className='flex flex-col'>

                            <label className='text-sm font-medium text-gray-700'>
                                Maximum Guests
                            </label>

                            <input
                                type='number'
                                min='1'
                                value={inputs.maxGuests}
                                onChange={(e) =>
                                    setInputs({
                                        ...inputs,
                                        maxGuests: e.target.value
                                    })
                                }
                                className='mt-2 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500'
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className='mt-8'>

                        <label className='text-sm font-medium text-gray-700'>
                            Room Description
                        </label>

                        <textarea
                            rows='5'
                            placeholder='Write room description here...'
                            value={inputs.description}
                            onChange={(e) =>
                                setInputs({
                                    ...inputs,
                                    description: e.target.value
                                })
                            }
                            className='w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:border-blue-500'
                        />
                    </div>

                    {/* Amenities */}
                    <div className='mt-10'>

                        <p className='text-lg font-semibold text-gray-800 mb-5'>
                            Amenities
                        </p>

                        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>

                            {Object.keys(inputs.amenities).map((amenity, index) => (

                                <label
                                    key={index}
                                    className='flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 transition-all'
                                >

                                    <input
                                        type='checkbox'
                                        checked={inputs.amenities[amenity]}
                                        onChange={() => handleAmenityChange(amenity)}
                                        className='w-4 h-4'
                                    />

                                    <span className='text-gray-700 text-sm'>
                                        {amenity}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={submitting}
                        className='mt-10 bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white px-8 py-3 rounded-xl font-medium cursor-pointer disabled:opacity-60'
                    >
                        {submitting ? 'Adding Room...' : 'Add Room'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddRoom
