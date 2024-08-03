import React from 'react'
import Navbar from '../components/Navbar'
import BreadCrum from '../components/BreadCrum'

const Customers = () => {
  return (
    <div>
      <Navbar title={"Customers"}/>
      <BreadCrum title={"Customers"} back={"/"} />
    </div>
  )
}

export default Customers
