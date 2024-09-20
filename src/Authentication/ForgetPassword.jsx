import React, { useState } from "react";
import { metrix } from "../assets";
import { IoMailOutline } from "react-icons/io5";
import { IoKeyOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import { CiLock } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import {
  mailVerification,
  mailOtpVerify,
  resetPassword,
} from "../helper/helper";
import { loginWithOtp, passwordReset } from "../helper/validate";
import LoadingButton from "../components/LoadingButton";
import Otp from "./Otp";

const ForgetPassword = () => {
  const [enterDetail, setEnterDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState(false);

  const handleOtpChange = (newOtp) => {
    setOtp(newOtp.join(""));
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
      email: "",
      otp: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const sendMail = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        try {
          setPassword(true);
          setMailSent(false);
          setEnterDetail(true);
        } catch (err) {
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

  const forgetPassword = async (e, values) => {
    e.preventDefault();
    setLoading(true);

    const errors = await passwordReset(values);

    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    } else {
      try {
        let resetPromise = resetPassword(values);

        toast.promise(resetPromise, {
          loading: "Resetting Password...",
          success: <b>Password Reset Successfully... !</b>,
          error: (err) => (
            <b>
              {err.response?.data?.message ||
                "Wasn't able to reset password... !"}
            </b>
          ),
        });

        await resetPromise;

        console.log("Password reset successfully");
        setLoading(false);
      } catch (error) {
        console.error("Error resetting password:", error);
        setLoading(false);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <div className="w-[full] font-poppins flex h-screen justify-center items-center">
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
                    <p>
                      We have sent a code to your email {formik.values.email}
                    </p>
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
                        setMailSent(false);
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
            className="max-w-[400px] w-[100%] shadow-lg px-[20px]"
            onSubmit={formik.handleSubmit}
          >
            <div className="p-[20px] md:px-[40px] md:py-[40px] bg-white rounded-xl ">
              <div className="flex justify-center items-center flex-col">
                <img width={"60px"} src={metrix} />
                <h3 className="pt-[15px] font-semibold text-[20px]">
                  Forgot Password !
                </h3>
              </div>

              {enterDetail === false && (
                <div className="mt-[40px] col-span-2 w-full mt-[15px] sm:col-span-1">
                  <label
                    htmlFor="email"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    {...formik.getFieldProps("email")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Email"
                    required
                  />
                </div>
              )}

              {password == true && (
                <div>
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
                </div>
              )}

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
                {loading ? (
                  <LoadingButton />
                ) : (
                  <div>
                    {" "}
                    {password ? (
                      <button
                        onClick={(e) => {
                          forgetPassword(e , formik.values);
                        }}
                        className="bg-primary px-[20px] py-2 mt-[20px] rounded-md text-white text-[18px]"
                      >
                        Reset Password
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          sendMail(e);
                        }}
                        className="bg-primary px-[20px] py-2 mt-[20px] rounded-md text-white text-[18px]"
                      >
                        Send OTP
                      </button>
                    )}{" "}
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ForgetPassword;
