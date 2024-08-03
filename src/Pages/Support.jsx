import React from 'react'
import Navbar from '../components/Navbar'
import BreadCrum from '../components/BreadCrum'

const Support = () => {
  return (
    <div>
      <Navbar title={"Support"}/>
      <BreadCrum title={"Support"} back={"/"}/>
    </div>
  )
}

export default Support
