import React, { useEffect, useState } from 'react'
import { metrix } from '../assets'
import { IoMailOutline } from "react-icons/io5";
import { IoKeyOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { NavLink, useNavigate } from 'react-router-dom';
import  {toast ,Toaster} from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidate , loginValidate } from '../helper/validate';
import { postOrderTable, registerUser , verifyPassword } from '../helper/helper';
import { Button } from "@nextui-org/react";

const Register = () => {
  const [loading , setLoading] = useState(false);

  const navigate = useNavigate();
  const tables = {
      table: {
        id: 1,
        title: "Ground",
        tables:  1,
      },
  };

  const postTable = async (tables) => {
    const res = await postOrderTable(tables);
    console.log("snehuuuuu", res);
  };
  

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
        setLoading(true);
        values = await Object.assign(values);
        let registerPromise = registerUser(values);
        toast.promise(registerPromise , {
          loading : 'Creating...',
          success : <b>Register Successfully... !</b>,
          error : <b>Could not Register... !</b>
        });

        console.log("values:", values);

        let loginPromise = verifyPassword({
          username: values.username,
          password: values.password,
        });

        loginPromise.then((res) => {
          try {
            let { token } = res.data.data;
            console.log('token:', token);
            localStorage.setItem("token", token);

            postTable(tables);
            navigate("/dashboard");
            setLoading(false);
          } catch (error) {
            console.error("Error extracting token:", error);
            setLoading(false);
          }
        });
    }
  })

  return (
    <div className="w-full font-poppins flex justify-center items-center">
      <Toaster position="top-center" reverseOrder="false"></Toaster>
      <form
        className="max-w-[400px] w-[100%] shadow-lg px-[20px]"
        onSubmit={formik.handleSubmit}
      >
        <div className="py-[20px] px-[20px] md:px-[30px] my-[30px] md:py-[20px] bg-white rounded-xl ">
          <div className="flex justify-center items-center flex-col">
            <img width={"60px"} src={metrix} />
            <h3 className="pt-[15px] font-semibold text-[20px]">
              Welcome back!
            </h3>
            <p className="pb-[40px] pt-[5px]">Register to your account</p>
          </div>

          <div className="w-full flex flex-col justify-center items-center">
            <div className="col-span-2 w-full sm:col-span-1">
              <label
                htmlFor="username"
                className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                {...formik.getFieldProps("username")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter Username"
              />
            </div>

            <div className="col-span-2 w-full sm:col-span-1">
              <label
                htmlFor="email"
                className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="text"
                {...formik.getFieldProps("email")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter Email"
              />
            </div>

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
          </div>

          <NavLink to={"/forget-password"}>
            <p className="text-primary flex justify-end items-center px-[10px]">
              Recover Password
            </p>
          </NavLink>
          <div className="flex justify-center items-center flex-col">
            <p className="py-[15px]">
              Already have an account ?
              <NavLink to={"/login"}>
                <span className="text-primary"> Login </span>
              </NavLink>
            </p>
            {!loading && (
              <div>
                <button
                  onClick={() => {
                    setLoading(true), formik.handleSubmit();
                  }}
                  type="submit"
                  className="bg-primary px-[20px] py-2 rounded-md text-white text-[18px]"
                >
                  Register
                </button>
              </div>
            )}
            {loading && (
              <Button color="primary" isLoading>
                Loading
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register