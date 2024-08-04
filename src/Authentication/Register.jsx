import React, { useEffect, useState } from 'react'
import { metrix } from '../assets'
import { IoMailOutline } from "react-icons/io5";
import { IoKeyOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { NavLink, useNavigate } from 'react-router-dom';
import  {toast ,Toaster} from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidate  } from '../helper/validate';
import { registerUser } from '../helper/helper';

const Register = () => {

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues : {
      username : '123456',
      email : '123456@gmail.com',
      password : '123456'
    },
    validate : registerValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
        values = await Object.assign(values);
        let registerPromise = registerUser(values);
        toast.promise(registerPromise , {
          loading : 'Creating...',
          success : <b>Register Successfully... !</b>,
          error : <b>Could not Register... !</b>
        });

        registerPromise.then(function(){navigate('/login')});
    }
  })

  return (
    <div className='w-full font-poppins flex justify-center items-center'>
    <Toaster position='top-center' reverseOrder='false'></Toaster>
    <form onSubmit={formik.handleSubmit}>
      <div className='py-[20px] px-[20px] md:px-[30px] my-[30px] md:py-[40px] bg-white rounded-xl '>
         <div className='flex justify-center items-center flex-col'>
            <img width={"60px"} src={metrix}/>
            <h3 className='pt-[15px] font-semibold text-[20px]'>Welcome back!</h3>
            <p className='pb-[40px] pt-[5px]'>Register to your account</p>
         </div>

         <div className='w-full flex flex-col justify-center items-center'>
            <div className='flex px-[15px] md:px-[20px] rounded-lg text-[18px] mb-[20px] justify-center items-center bg-[#EFF1F9] h-[52px]'> 
              <CiUser />
              <input {...formik.getFieldProps('username')} className='ml-[10px] h-[36px] outline-none bg-[#EFF1F9]' placeholder='Full Name' type='text'/>
            </div>

            <div className='flex px-[15px] md:px-[20px] rounded-lg text-[18px] justify-center items-center bg-[#EFF1F9] h-[52px]'> 
              <IoMailOutline />
              <input {...formik.getFieldProps('email')} className='ml-[10px] h-[36px] outline-none bg-[#EFF1F9]' placeholder='Email Address' type='email'/>
            </div>

            <div className='flex px-[15px] md:px-[20px] rounded-lg my-[20px] text-[18px] justify-center items-center bg-[#EFF1F9] h-[52px]'> 
              <CiLock />
              <input {...formik.getFieldProps('password')} className='ml-[10px] h-[36px] outline-none bg-[#EFF1F9]' placeholder='Password' type='password'/>
            </div>
         </div>

         <NavLink to={'/forget-password'}><p className='text-primary flex justify-end items-center px-[10px]'>Recover Password</p></NavLink>
          <div className='flex justify-center items-center flex-col'>
              <p className='py-[15px]'>Already have an account ? <NavLink to={'/login'}><span className='text-primary'> Login </span></NavLink>  </p>
              <button type="submit" className='bg-primary px-[20px] py-2 mt-[20px] rounded-md text-white text-[18px]'>Register</button>
          </div>
      </div>
      </form>
    </div>
  )
}

export default Register