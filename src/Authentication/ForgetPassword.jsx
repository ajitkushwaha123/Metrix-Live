import React, { useState } from 'react'
import { metrix } from '../assets'
import { IoMailOutline } from "react-icons/io5";
import { IoKeyOutline } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import { useFormik } from 'formik';
import { passwordReset} from '../helper/validate';
import { Toaster } from 'react-hot-toast';
import { CiLock } from "react-icons/ci";

const ForgetPassword = () => {
  const formik = useFormik({
    initialValues : {
      password : '',
      confirmPassword : '',
    },
    validate : passwordReset,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
       console.log(values);
    }
  })

  return (
    <div className='w-[full] font-poppins flex h-screen justify-center items-center'>
    <Toaster position='top-center' reverseOrder='false'></Toaster>
    <form onSubmit={formik.handleSubmit}>
      <div className='px-[40px] py-[40px] bg-white rounded-xl '>
         <div className='flex justify-center items-center flex-col'>
            <img width={"60px"} src={metrix}/>
            <h3 className='pt-[15px] font-semibold text-[20px]'>Forgot Password !</h3>
            <p className='pb-[40px] pt-[5px]'>Enter details to reset your password</p>
         </div>

         <div className='w-[full] flex flex-col justify-center items-center'>
            <div className='flex rounded-lg my-[20px] text-[18px] justify-center items-center bg-[#EFF1F9] w-[375px] h-[52px]'> 
              <CiLock />
              <input {...formik.getFieldProps('password')} className='w-[303px] ml-[10px] h-[36px] outline-none bg-[#EFF1F9]' placeholder='Password' type='password'/>
            </div>

            <div className='flex rounded-lg my-[20px] text-[18px] justify-center items-center bg-[#EFF1F9] w-[375px] h-[52px]'> 
              <IoKeyOutline />
              <input {...formik.getFieldProps('confirmPassword')} className='w-[303px] ml-[10px] h-[36px] outline-none bg-[#EFF1F9]' placeholder='Confirm Password' type='password'/>
            </div>
         </div>

         <p className='text-primary flex justify-end items-center px-[40px]'>Resend OTP</p>
          <div className='flex justify-center items-center flex-col'>
              <p className='py-[15px]'>Haven't Registered ? <NavLink to={'/register'}><span className='text-primary'> Sign Up </span></NavLink> </p>
              <button className='bg-primary px-[20px] py-2 mt-[20px] rounded-md text-white text-[18px]'>Send OTP</button>
          </div>
      </div>
      </form>
    </div>
  )
}

export default ForgetPassword
