import React from 'react'
import { FaBell } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import useFetch from '../hooks/fetch.hooks';
import { FaShop } from "react-icons/fa6";
import{metrix} from '../assets/index';

const Navbar = ({title}) => {

   const [{isLoading , apiData , serverError}] = useFetch();

   if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
   if(serverError)return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="w-[100%] font-poppins h-[70px] border-b-2 border-secondary bg-[white] flex justify-between items-center sm:px-[40px]">
      <div className="flex justify-between items-center">
        <img className="sm:hidden" src={metrix} />
        <div className="text-[22px] text-medium">
          <h2>{title}</h2>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <button className="bg-secondary flex justify-center items-center sm:px-[16px] px-[8px] sm:py-[8px] py-[4px] rounded-xl mr-[10px] sm:mr-[20px]">
          <FaShop className="mr-[5px] sm:mr-[10px]" />
          {apiData?.name || "Nancy Shop"}
        </button>
        <p className="text-primary hidden sm:block text-[20px] mx-[10px]">
          <FaBell />
        </p>
        <div className="w-[45px] mx-[10px] h-[45px] flex justify-center items-center bg-primary rounded-full">
          <img
            width={"40px"}
            height={"40px"}
            className="rounded-full "
            src={
              apiData?.profile ||
              "https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_3.jpg"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar
