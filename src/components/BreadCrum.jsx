import React from 'react'
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { NavLink} from 'react-router-dom';

const BreadCrum = ({title , back , title2 , title3 , title4 ,title5 ,title6 , title7}) => {
  return (
    <div className='w-full px-[40px] flex justify-start items-center h-[40px]'>
       <NavLink to={'/'}><SiHomeassistantcommunitystore className='text-primary mr-[10px]'/></NavLink> 
        <h3 className='flex justify-center items-center'><p className='mr-[10px]'>{back}</p> {title}</h3>
        {title2 && <h3 className='flex justify-center items-center'><p className='mr-[10px] ml-[10px]'>{back}</p> {title2}</h3>}
        {title3 && <h3 className='flex justify-center items-center'><p className='mr-[10px] ml-[10px]'>{back}</p> {title3}</h3>}
        {title4 && <h3 className='flex justify-center items-center'><p className='mr-[10px] ml-[10px]'>{back}</p> {title4}</h3>}
        {title5 && <h3 className='flex justify-center items-center'><p className='mr-[10px] ml-[10px]'>{back}</p> {title5}</h3>}
        {title6 && <h3 className='flex justify-center items-center'><p className='mr-[10px] ml-[10px]'>{back}</p> {title6}</h3>}
        {title7 && <h3 className='flex justify-center items-center'><p className='mr-[10px] ml-[10px]'>{back}</p> {title7}</h3>}

        
    </div>
  )
}

export default BreadCrum
