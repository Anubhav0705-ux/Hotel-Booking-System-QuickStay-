import React from 'react'
import assets from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {

    const sidebarLinks = [
        {name: "Darshboard", link: "/owner", icon: assets.dashboardIcon},
        {name: "Rooms", link: "/owner/add-room", icon: assets.addIcon},
        {name: "Bookings", link: "/owner/list-room", icon: assets.listIcon},
    ]

  return (
    <div className= 'md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col transition-all duration-300'>
        {sidebarLinks.map((item, index) => (
            <NavLink to ={item.link} key = {index} end = '/owner' className = {({isActive})=> `flex items-center py-3 px-4 md:px-8 gap-3 ${isActive? "border-l-4 border-blue-500 bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"} transition-all duration-300`}>
                <img src={item.icon} alt = {item.name} className='h-5 w-5'/>
                <p className='md:block hidden text-center'>{item.name}</p>
            </NavLink>
        ))}
    </div>
  )
}

export default Sidebar