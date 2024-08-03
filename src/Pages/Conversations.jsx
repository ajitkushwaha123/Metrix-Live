import React from 'react'
import Navbar from '../components/Navbar'
import BreadCrum from '../components/BreadCrum'

const Conversations = () => {
  return (
    <div>
      <Navbar title={"Conversations"} />
      <BreadCrum title={"Conversations"} back={"/"} />
    </div>
  )
}

export default Conversations
