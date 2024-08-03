import React from 'react'
import Navbar from '../components/Navbar'
import BreadCrum from '../components/BreadCrum'

const Gift = () => {
  return (
    <div>
      <Navbar title={"Gift"}/>
      <BreadCrum title={"Gift"} back="/"/>
    </div>
  )
}

export default Gift
