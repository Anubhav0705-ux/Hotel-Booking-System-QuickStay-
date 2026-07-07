import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/react'
import toast from 'react-hot-toast'

// Single shared axios instance pointed at the Express API.
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate()
    const { getToken } = useAuth()
    const { user } = useUser()

    const [isOwner, setIsOwner] = useState(false)
    const [showHotelReg, setShowHotelReg] = useState(false)
    const [hotelData, setHotelData] = useState(null)
    const [rooms, setRooms] = useState([])
    const [roomsLoading, setRoomsLoading] = useState(true)
    const [searchedCities, setSearchedCities] = useState([])

    const currency = '$'

    // Attaches the current Clerk session token to a request config.
    const authHeaders = async () => {
        const token = await getToken()
        return { headers: { Authorization: `Bearer ${token}` } }
    }

    // All published rooms across every hotel — used by Home/FeaturedDestination
    // and as the base dataset AllRooms filters client-side.
    const fetchRooms = useCallback(async (params = {}) => {
        try {
            setRoomsLoading(true)
            const { data } = await axios.get('/api/rooms', { params })
            if (data.success) setRooms(data.rooms)
        } catch (error) {
            console.error(error)
            toast.error('Could not load rooms. Is the server running?')
        } finally {
            setRoomsLoading(false)
        }
    }, [])

    // Checks whether the logged-in user already owns a hotel, and
    // keeps isOwner / hotelData in sync with the backend.
    const fetchOwnerHotel = useCallback(async () => {
        if (!user) return
        try {
            const config = await authHeaders()
            const { data } = await axios.get('/api/hotels/owner/me', config)
            if (data.success) {
                setHotelData(data.hotel)
                setIsOwner(!!data.hotel)
            }
        } catch (error) {
            console.error(error)
        }
    }, [user])

    const fetchProfile = useCallback(async () => {
        if (!user) return
        try {
            const config = await authHeaders()
            const { data } = await axios.get('/api/users/me', config)
            if (data.success) {
                setSearchedCities(data.user.recentSearchedCities || [])
                setIsOwner(data.user.role === 'hotelOwner')
            }
        } catch (error) {
            console.error(error)
        }
    }, [user])

    const addRecentSearchedCity = async (city) => {
        setSearchedCities((prev) => [city, ...prev.filter((c) => c !== city)].slice(0, 3))
        if (!user) return
        try {
            const config = await authHeaders()
            await axios.post('/api/users/recent-searches', { city }, config)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchRooms()
    }, [fetchRooms])

    useEffect(() => {
        if (user) {
            fetchProfile()
            fetchOwnerHotel()
        } else {
            setIsOwner(false)
            setHotelData(null)
            setSearchedCities([])
        }
    }, [user, fetchProfile, fetchOwnerHotel])

    const value = {
        axios,
        navigate,
        currency,
        user,
        getToken,
        authHeaders,
        isOwner,
        setIsOwner,
        hotelData,
        setHotelData,
        showHotelReg,
        setShowHotelReg,
        rooms,
        roomsLoading,
        fetchRooms,
        fetchOwnerHotel,
        searchedCities,
        addRecentSearchedCity,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
