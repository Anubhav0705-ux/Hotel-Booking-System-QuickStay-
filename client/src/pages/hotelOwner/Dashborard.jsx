import React, { useEffect, useState } from 'react'
import assets from '../../assets/assets'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {
    const { axios, authHeaders } = useAppContext()

    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        bookings: [],
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true)
                const config = await authHeaders()
                const { data } = await axios.get('/api/bookings/hotel', config)
                if (data.success) setDashboardData(data.dashboardData)
            } catch (error) {
                toast.error('Could not load dashboard data')
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard()
    }, [axios, authHeaders])

    return (

        <div className='w-full px-6 md:px-10 py-8 bg-gray-50 min-h-screen'>

            {/* Title */}
            <Title
                title='Dashboard'
                align='left'
                font='outfit'
                subTitle='Monitor your room listings, track bookings and analyze revenue — all in one place. Stay updated with real-time insights to ensure smooth operations.'
            />

            {/* Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 max-w-3xl'>

                {/* Total Bookings */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-5'>

                    <div className='bg-blue-100 p-4 rounded-xl'>
                        <img
                            src={assets.totalBookingIcon}
                            alt='booking-icon'
                            className='w-10 h-10'
                        />
                    </div>

                    <div>
                        <p className='text-gray-500 text-sm'>
                            Total Bookings
                        </p>

                        <h2 className='text-3xl font-bold text-gray-800 mt-1'>
                            {loading ? '...' : dashboardData.totalBookings}
                        </h2>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-5'>

                    <div className='bg-green-100 p-4 rounded-xl'>
                        <img
                            src={assets.totalRevenueIcon}
                            alt='revenue-icon'
                            className='w-10 h-10'
                        />
                    </div>

                    <div>
                        <p className='text-gray-500 text-sm'>
                            Total Revenue
                        </p>

                        <h2 className='text-3xl font-bold text-gray-800 mt-1'>
                            ${loading ? '...' : dashboardData.totalRevenue}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className='mt-12'>

                <div className='flex items-center justify-between mb-5'>

                    <h2 className='text-2xl font-semibold text-gray-800'>
                        Recent Bookings
                    </h2>
                </div>

                {/* Table */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>

                    <table className='w-full text-left border-collapse'>

                        {/* Table Head */}
                        <thead className='bg-gray-100 text-gray-700 text-sm uppercase tracking-wide'>

                            <tr>
                                <th className='px-6 py-4 font-semibold'>
                                    User Name
                                </th>

                                <th className='px-6 py-4 font-semibold max-sm:hidden'>
                                    Room Name
                                </th>

                                <th className='px-6 py-4 font-semibold text-center'>
                                    Total Amount
                                </th>

                                <th className='px-6 py-4 font-semibold text-center'>
                                    Payment Status
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>

                            {loading ? (
                                <tr><td className='px-6 py-6 text-gray-500' colSpan={4}>Loading...</td></tr>
                            ) : dashboardData.bookings.length === 0 ? (
                                <tr><td className='px-6 py-6 text-gray-500' colSpan={4}>No bookings yet.</td></tr>
                            ) : dashboardData.bookings.map((item, index) => (

                                <tr
                                    key={index}
                                    className='border-t border-gray-200 hover:bg-gray-50 transition-all'
                                >

                                    {/* User */}
                                    <td className='px-6 py-5 text-gray-800 font-medium'>
                                        {item.user?.username || 'Guest'}
                                    </td>

                                    {/* Room */}
                                    <td className='px-6 py-5 text-gray-600 max-sm:hidden'>
                                        {item.room?.roomType}
                                    </td>

                                    {/* Amount */}
                                    <td className='px-6 py-5 text-center font-semibold text-gray-800'>
                                        ${item.totalPrice.toFixed(2)}
                                    </td>

                                    {/* Status */}
                                    <td className='px-6 py-5 text-center'>

                                        <span
                                            className={`px-4 py-1.5 rounded-full text-xs font-semibold
                                            
                                            ${item.isPaid
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {item.isPaid ? 'Completed' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
