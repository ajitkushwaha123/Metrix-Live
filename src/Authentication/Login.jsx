import React, { useState } from "react";
import { metrix } from "../assets";
import { NavLink, useNavigate } from "react-router-dom";
import { otpLogin, verifyPassword } from "../helper/helper";
import { useFormik } from "formik";
import { loginValidate, loginWithOtp } from "../helper/validate";
import { toast, Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import LoadingButton from "../components/LoadingButton";
import { authenticate, mailVerification , mailOtpVerify } from "../helper/helper";

import Otp from "./Otp";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [optLogin, setOtpLogin] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleOtpChange = (newOtp) => {
    setOtp(newOtp.join(""));
  };

  const setUsername = useAuthStore((state) => state.setUsername);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
      otp: "",
      subject: "OTP for verification",
    },
    validate: loginValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      setUsername(values.username);

      let loginPromise = verifyPassword({
        username: values.username,
        password: values.password,
      });

      toast.promise(loginPromise, {
        loading: "Checking...",
        success: <b>Login Successfully... !</b>,
        error: (err) => (
          <b>{err.response?.data?.message || "Could not Login... !"}</b>
        ),
      });

      loginPromise
        .then((res) => {
          try {
            let { token } = res.data.data;
            localStorage.setItem("token", token);
            setLoading(false);
            navigate("/dashboard");
            window.location.reload();
          } catch (error) {
            console.error("Error extracting token:", error);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error(
            "Error in login:",
            error.response?.data?.message || error.message
          );
          setLoading(false);
        });
    },
  });

  const sendMail = async (e) => {
    e.preventDefault();
    setLoading(true);

    // formik.values.email = formik.values.username;

    // console.log("formik.values.username", formik.values.email);

    const errors = await loginWithOtp({ email: formik.values.email });

    console.log("errors", errors);

    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    } else {
      try {
        let sendOtpPromise = mailVerification(formik.values);

        toast.promise(sendOtpPromise, {
          loading: "Sending OTP...",
          success: <b>OTP Sent Successfully... !</b>,
          error: (err) => (
            <b>
              {err.response?.data?.message || "Wasn't able to send OTP... !"}
            </b>
          ),
        });

        await sendOtpPromise;

        console.log("OTP sent successfully");
        setMailSent(true);
        setLoading(false);
      } catch (error) {
        console.error("Error sending OTP:", error);
        setLoading(false);
      }
    }
  };

const loginOtp = async (e, values) => {
  console.log("email", values);
  e.preventDefault();
  setLoading(true);

  try {
    const loginOtpPromise = otpLogin(values);
    toast.promise(loginOtpPromise, {
      loading: "Login...",
      success: <b>Logged In Successfully... !</b>,
      error: (err) => (
        <b>{err.response?.data?.message || "Wasn't able to Login... !"}</b>
      ),
    });

    const res = await loginOtpPromise;

    try {
      let { token } = res.data.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      console.error("Error extracting token:", error);
    }
  } catch (error) {
    console.error("Error In Login:", error);
  } finally {
    setLoading(false);
  }
};


  const verifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (otp.length !== 4) {
      toast.error("Please enter a valid OTP... !");
      setLoading(false);
      return;
    }

    formik.values.otp = otp;

    try {
      const verifyPromise = mailOtpVerify(formik.values);

      toast.promise(verifyPromise, {
        loading: "Verifying OTP...!",
        success: <b>OTP Verified Successfully... !</b>,
        error: (err) => <b>{err.error || "Invalid OTP... !"}</b>,
      });

      await verifyPromise;

      verifyPromise.then((res) => {
        try{
          const responsePromise = loginOtp(e , formik.values);
        }catch(err){
          console.error("Error In Login :", err);
          setLoading(false);
        }
      });

      setLoading(false);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setLoading(false);
    }
  };


  return (
    <div className="w-full h-[90vh] font-poppins flex justify-center items-center">
      <Toaster position="top-center" reverseOrder="false"></Toaster>
      {mailSent ? (
        <div class="relative mx-[20px] font-poppins flex min-h-screen flex-col justify-center overflow-hidden">
          <div class="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-md rounded-2xl">
            <div class="mx-auto flex w-full max-w-md flex-col space-y-10">
              <div class="flex flex-col items-center justify-center text-center space-y-2">
                <div class="font-medium text-2xl">
                  <p>Email Verification</p>
                </div>
                <div class="flex flex-row text-sm font-medium text-gray-400">
                  <p>We have sent a code to your email {formik.values.email}</p>
                </div>
              </div>

              <div className="flex justify-center flex flex-col items-center px-auto">
                <Otp
                  {...formik.getFieldProps("otp")}
                  inputOtp={handleOtpChange}
                />
                {/* <p>OTP entered: {otp}</p> */}

                <div className="flex w-[70%] mt-[10px] justify-end items-end">
                  <p
                    onClick={() => {
                      setMailSent(false)
                    }}
                    className="text-primary items-end  justify-end cursor-pointer items-center pt-[4px]"
                  >
                    Resend OTP
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center w-[100%]">
                {!loading ? (
                  <button
                    onClick={(e) => {
                      verifyEmail(e);
                    }}
                    className="bg-primary px-[12px] py-2 text-white rounded-md "
                  >
                    Submit
                  </button>
                ) : (
                  <LoadingButton />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form
          className="max-w-[380px] shadow-lg w-[100%] px-[20px]"
          onSubmit={formik.handleSubmit}
        >
          <div className="md:px-[40px] my-[30px] px-[15px] py-[20px] md:py-[20px] bg-white rounded-xl ">
            <div className="flex justify-center items-center flex-col">
              <img width={"60px"} src={metrix} />
              <h3 className="pt-[15px] font-semibold text-[20px]">
                Welcome Back !
              </h3>
              <p className="pb-[40px] pt-[5px]">Login to your account</p>
            </div>

            <div className="flex  flex-col justify-center items-center">
              {optLogin ? (
                <div className=" w-full sm:col-span-1">
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
              ) : (
                <div className=" w-full sm:col-span-1">
                  <label
                    htmlFor="username"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username or Email
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("username")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Username or Email"
                  />
                </div>
              )}

              {!optLogin && (
                <div className=" w-full mt-[15px] sm:col-span-1">
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
              )}
            </div>

            <div className="flex mt-[20px] justify-between">
              {!optLogin && (
                <p
                  onClick={() => setOtpLogin(true)}
                  className="text-primary cursor-pointer flex justify-start items-center pt-[4px]"
                >
                  OTP ?
                </p>
              )}

              {optLogin ? (
                <p
                  onClick={() => {
                    setOtpLogin(false);
                  }}
                  className="text-primary w-full justify-end cursor-pointer flex justify-end items-center pt-[4px]"
                >
                  Login with Password
                </p>
              ) : (
                <NavLink to={"/forget-password"}>
                  <p className="text-primary cursor-pointer flex justify-end items-center pt-[4px]">
                    Recover Password
                  </p>
                </NavLink>
              )}
            </div>
            <div className="flex justify-center items-center flex-col">
              <p className="pt-[15px]">
                Don’t have an account?
                <NavLink to={"/register"}>
                  <span className="text-primary cursor-pointer"> Sign Up </span>
                </NavLink>
              </p>
              {!loading && (
                <div>
                  {optLogin ? (
                    <button
                      onClick={(e) => {
                        sendMail(e);
                      }}
                      type="submit"
                      className="bg-primary cursor-pointer px-[20px] font-poppins py-2 mt-[20px] rounded-xl text-white text-[18px]"
                    >
                      Send OTP
                    </button>
                  ) : (
                    <button
                      onClick={formik.handleSubmit}
                      type="submit"
                      className="bg-primary cursor-pointer px-[20px] font-poppins py-2 mt-[20px] rounded-xl text-white text-[18px]"
                    >
                      Login
                    </button>
                  )}
                </div>
              )}
              {loading && (
                <div className="mt-[20px]">
                  <LoadingButton />
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
