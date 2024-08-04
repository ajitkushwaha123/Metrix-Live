import React from 'react'
import Navbar from '../components/Navbar'
import BreadCrum from '../components/BreadCrum'
import Profile from './Profile'

const Settings = () => {
  return (
    <div className='w-[100%] overflow-y-hidden'>
      <BreadCrum title={"Settings"} back={"/"}/>
      <div className='overflow-y-hidden w-[100%]'><Profile /></div>
    </div>
  )
}

export default Settings
