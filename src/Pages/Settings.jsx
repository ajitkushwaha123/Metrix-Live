import React from 'react'
import Navbar from '../components/Navbar'
import BreadCrum from '../components/BreadCrum'
import Profile from './Profile'

const Settings = () => {
  return (
    <div>
      <BreadCrum title={"Settings"} back={"/"}/>
      <Profile />
    </div>
  )
}

export default Settings
