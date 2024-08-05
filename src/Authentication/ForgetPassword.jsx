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
    <div className="w-[full] font-poppins flex h-screen justify-center items-center">
      <Toaster position="top-center" reverseOrder="false"></Toaster>
      <form
        className="max-w-[400px] w-[100%] px-[20px]"
        onSubmit={formik.handleSubmit}
      >
        <div className="p-[20px] md:px-[40px] md:py-[40px] bg-white rounded-xl ">
          <div className="flex justify-center items-center flex-col">
            <img width={"60px"} src={metrix} />
            <h3 className="pt-[15px] font-semibold text-[20px]">
              Forgot Password !
            </h3>
          </div>

          <div className="w-[full] flex flex-col justify-center items-center">
            <div className="col-span-2 w-full mt-[15px] sm:col-span-1">
              <label
                htmlFor="password"
                className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                {...formik.getFieldProps("password")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter Password"
              />
            </div>

            <div className="col-span-2 w-full mt-[15px] sm:col-span-1">
              <label
                htmlFor="password"
                className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm Password
              </label>
              <input
                type="password"
                {...formik.getFieldProps("confirmPassword")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <p className="text-primary flex justify-end items-center pt-[4px]">
            Resend OTP
          </p>
          <div className="flex justify-center items-center flex-col">
            <p className="py-[15px]">
              Haven't Registered ?{" "}
              <NavLink to={"/register"}>
                <span className="text-primary"> Sign Up </span>
              </NavLink>{" "}
            </p>
            <button className="bg-primary px-[20px] py-2 mt-[20px] rounded-md text-white text-[18px]">
              Send OTP
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ForgetPassword
