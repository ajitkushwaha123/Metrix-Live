import React, { useState } from 'react'
import { IoMailOutline } from "react-icons/io5";
import { IoKeyOutline } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import { useFormik } from 'formik';
import { loginValidate, profileValidate } from '../helper/validate';
import toast, { Toaster } from 'react-hot-toast';
import { metrix } from '../assets';
import {useAuthStore} from '../store/store';
import { updateUser } from '../helper/helper';
import useFetch from '../hooks/fetch.hooks';
import convertToBase64 from '../helper/convert';

const Profile = () => {
  const [file , setFile] = useState();
  const [{isLoading , apiData , serverError}] = useFetch();

  const formik = useFormik({
    initialValues : {
      name : apiData?.name || '',
      email : apiData?.email || '',
      phone : apiData?.phone || '',
      address : apiData?.address || '',
      city : apiData?.city || '',
      profile : apiData?.profile || '',
    },
    enableReinitialize : true,
    validate : profileValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
       values = await Object.assign(values , {profile : file || ''});
       let updatePromise = updateUser(values);
       toast.promise(updatePromise , {
        loading : 'Updating...',
        success : <b>Update Successfully... !</b>,
        error : <b>Could not update... !</b>
       })
       console.log(apiData?.email);
       console.log("userData" , values);
    }
  })

  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if(serverError)return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="font-poppins py-[50px] flex items-center justify-center">
      <form onSubmit={formik.handleSubmit} className="">
        <Toaster position="top-center" reverseOrder="false"></Toaster>
        <div className="">
          <div className="bg-white mx-[20px] rounded-xl flex items-center flex-col justify-center">
            <label className="ml-[100px] pt-[20px]" htmlFor="profile">
              <img
                width={"200px"}
                height={"200px"}
                name="profile"
                className="rounded-full"
                src={
                  file ||
                  apiData?.profile ||
                  "https://i.pinimg.com/564x/44/27/2d/44272df32b1b832c9ea8f596fb4d76b2.jpg"
                }
              />
              <input
                className="opacity-0"
                onChange={onUpload}
                type="file"
                id="profile"
              />
            </label>
            <div className="flex rounded-lg px-[15px] mb-[20px] text-[18px] justify-center items-center bg-[#EFF1F9] h-[52px]">
              <IoKeyOutline />
              <input
                {...formik.getFieldProps("name")}
                className=" ml-[10px] h-[36px] outline-none bg-[#EFF1F9]"
                placeholder="Name"
                type="name"
              />
            </div>

            <div className="flex rounded-lg px-[15px] text-[18px] justify-center items-center bg-[#EFF1F9]  h-[52px]">
              <IoMailOutline />
              <input
                {...formik.getFieldProps("email")}
                className=" ml-[10px] h-[36px] outline-none bg-[#EFF1F9]"
                placeholder="Email Address"
                type="email"
              />
            </div>

            <div className="flex rounded-lg px-[15px] my-[20px] text-[18px] justify-center items-center bg-[#EFF1F9]  h-[52px]">
              <IoKeyOutline />
              <input
                {...formik.getFieldProps("phone")}
                className=" ml-[10px] h-[36px] outline-none bg-[#EFF1F9]"
                placeholder="Phone Number"
                type="phone"
              />
            </div>

            <div className="flex rounded-lg px-[15px] text-[18px] justify-center items-center bg-[#EFF1F9]  h-[52px]">
              <IoMailOutline />
              <input
                {...formik.getFieldProps("address")}
                className=" ml-[10px] h-[36px] outline-none bg-[#EFF1F9]"
                placeholder="Address"
                type="address"
              />
            </div>

            <div className="flex rounded-lg px-[15px] my-[20px] text-[18px] justify-center items-center bg-[#EFF1F9]  h-[52px]">
              <IoKeyOutline />
              <input
                {...formik.getFieldProps("address")}
                className=" ml-[10px] h-[36px] outline-none bg-[#EFF1F9]"
                placeholder="City"
                type="city"
              />
            </div>

            <button className="bg-primary mb-[20px] rounded-lg text-white px-6 text-[18px] py-2">
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile