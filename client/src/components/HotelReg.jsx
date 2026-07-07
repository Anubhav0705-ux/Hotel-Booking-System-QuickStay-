import React, { useState } from 'react'
import assets, { cities as fallbackCities } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const HotelReg = () => {
    const { axios, authHeaders, setShowHotelReg, setIsOwner, setHotelData } = useAppContext()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [contact, setContact] = useState('')
    const [city, setCity] = useState('')
    const [address, setAddress] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !contact || !address || !city) {
            toast.error('Please fill in all fields')
            return
        }

        try {
            setSubmitting(true)
            const config = await authHeaders()
            const { data } = await axios.post(
                '/api/hotels',
                { name, address, contact, city },
                config
            )

            if (data.success) {
                toast.success('Hotel registered! Welcome to the owner dashboard.')
                setHotelData(data.hotel)
                setIsOwner(true)
                setShowHotelReg(false)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Could not register hotel')
        } finally {
            setSubmitting(false)
        }
    }

    return (

        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/70'>

            <form onSubmit={handleSubmit} className='flex bg-white rounded-xl max-w-4xl w-full mx-4 overflow-hidden'>

                {/* Left Image */}
                <img
                    src={assets.regImage}
                    alt='reg-image'
                    className='w-1/2 hidden md:block object-cover'
                />

                {/* Right Content */}
                <div className='relative flex flex-col md:w-1/2 p-8 md:p-10'>

                    {/* Close Button */}
                    <img
                        src={assets.closeIcon}
                        alt='close-icon'
                        onClick={() => setShowHotelReg(false)}
                        className='absolute top-4 right-4 h-4 w-4 cursor-pointer'
                    />

                    {/* Heading */}
                    <p className='text-3xl font-semibold mt-6 text-gray-800'>
                        Register your hotel
                    </p>

                    <p className='text-sm text-gray-500 mt-2'>
                        Fill in the details below to register your property.
                    </p>

                    {/* Inputs */}
                    <div className='flex flex-col gap-4 mt-8'>

                        <input
                            type='text'
                            placeholder='Hotel Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500'
                        />

                        <input
                            type='email'
                            placeholder='Email Address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500'
                        />

                        <input
                            type='text'
                            placeholder='Phone Number'
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500'
                        />

                        <input
                            type='text'
                            placeholder='Address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500'
                        />

                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-gray-500'
                        >
                            <option value=''>Select City</option>
                            {fallbackCities.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                    </div>

                    {/* Button */}
                    <button
                        type='submit'
                        disabled={submitting}
                        className='bg-black text-white py-3 rounded-lg mt-8 hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-60'
                    >
                        {submitting ? 'Registering...' : 'Register Hotel'}
                    </button>

                </div>

            </form>

        </div>
    )
}

export default HotelReg
