import React from 'react'
import Navbar from '../components/Navbar'
import BreadCrum from '../components/BreadCrum'
import ComingSoon from '../Modals/ComingSoon'

const Gift = () => {
  return (
    <div>
      <BreadCrum title={"Gift"} back="/" />
      <div className='px-[50px]'>
        <ComingSoon />
      </div>
    </div>
  );
}

export default Gift
