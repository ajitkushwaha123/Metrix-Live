import React, { useEffect, useState } from "react";
import { metrix } from "../assets";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import {
  registerValidate,
  loginValidate,
  emailVerificationValidate,
} from "../helper/validate";
import {
  mailOtpVerify,
  mailVerification,
  postOrderTable,
  registerUser,
  verifyPassword,
} from "../helper/helper";
import LoadingButton from "../components/LoadingButton";
import Otp from "./Otp";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [mailVarified, setMailVarified] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleOtpChange = (newOtp) => {
    setOtp(newOtp.join("")); 
  };

  const navigate = useNavigate();
  const tables = {
    table: {
      id: 1,
      title: "Ground",
      tables: 1,
    },
  };

  const postTable = async (tables) => {
    const res = await postOrderTable(tables);
  };
const formik = useFormik({
  initialValues: {
    username: "",
    email: "",
    password: "",
    subject: "",
    otp: "",
  },
  validate: emailVerificationValidate,
  validateOnBlur: false,
  validateOnChange: false,
  onSubmit: async (values) => {
    setLoading(true);
    try {
      let registerPromise = registerUser(values);

      console.log("Register promise:", registerPromise);
      toast.promise(registerPromise, {
        loading: "Creating...",
        success: <b>Register Successfully... !</b>,
        error: (err) => (
          <b>{err.error || "Could not Register... !"}</b>
        ),
      });

      await registerPromise;

      registerPromise
        .then((res) => {
          let loginPromise = verifyPassword({
            username: values.username,
            password: values.password,
          });

          loginPromise
            .then((res) => {
              try {
                let { token } = res.data.data;
                console.log("token:", token);
                localStorage.setItem("token", token);

                postTable(tables);
                navigate("/dashboard");
                setLoading(false);
              } catch (error) {
                console.error("Error extracting token:", error);
                setLoading(false);
              }
            })
            .catch((error) => {
              toast.error("Invalid username or password");
              setLoading(false);
            });
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Could not Register... !"
          );
          setLoading(false);
        });
    } catch (error) {
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  },
});



  const sendOtp = async (e) => {
    e.preventDefault();

    const errors = await formik.validateForm(formik.values);

    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      return;
    }

    console.log("formik.values:", formik.values);
    setLoading(true);
    try {
      let sendOtpPromise = mailVerification(formik.values);

      toast.promise(sendOtpPromise, {
        loading: "Sending OTP...",
        success: <b>OTP Sent Successfully... !</b>,
        error: <b>Wasn't able to send OTP... !</b>,
      });

      await sendOtpPromise;

      console.log("OTP sent successfully");
      setMailSent(true);
      setLoading(false);
    } catch (error) {
      console.error("Error sending OTP:", error);
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
        error: <b>Invalid OTP... !</b>,
      });

      await verifyPromise;

      verifyPromise.then((res) => {
        setMailVarified(true);
        setMailSent(false);
      })

      console.log("OTP verified successfully");
      
      setLoading(false);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setLoading(false);
    }
  };


  return (
    <div className="w-full font-poppins flex h-[90vh] justify-center items-center">
      <Toaster position="top-center" reverseOrder="false"></Toaster>
      {!mailSent && (
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
                {mailVarified ? (
                  <input
                    readOnly
                    type="text"
                    {...formik.getFieldProps("username")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Username"
                  />
                ) : (
                  <input
                    type="text"
                    {...formik.getFieldProps("username")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Username"
                  />
                )}
              </div>

              <div className="col-span-2 mt-[20px] w-full sm:col-span-1">
                <label
                  htmlFor="email"
                  className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                {mailVarified ? (
                  <input
                    type="text"
                    readOnly
                    {...formik.getFieldProps("email")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Email"
                  />
                ) : (
                  <input
                    type="text"
                    {...formik.getFieldProps("email")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Email"
                  />
                )}
              </div>

              {mailVarified == true && (
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
              )}
            </div>

            {/* <NavLink to={"/forget-password"}>
            <p className="text-primary flex justify-end items-center px-[10px]">
              Recover Password
            </p>
          </NavLink> */}
            <div className="flex justify-center items-center flex-col">
              <p className="py-[15px]">
                Already have an account ?
                <NavLink to={"/login"}>
                  <span className="text-primary"> Login </span>
                </NavLink>
              </p>
              {!loading && (
                <div>
                  {!mailVarified ? (
                    <button
                      onClick={(e) => {
                        sendOtp(e);
                      }}
                      type="submit"
                      className="bg-primary px-[20px] py-2 rounded-xl text-white text-[18px]"
                    >
                      Send OTP
                    </button>
                  ) : (
                    <button
                      onClick={formik.handleSubmit}
                      type="submit"
                      className="bg-primary px-[20px] py-2 rounded-xl text-white text-[18px]"
                    >
                      Register
                    </button>
                  )}
                </div>
              )}
              {loading && (
                <div className="">
                  <LoadingButton />
                </div>
              )}
            </div>
          </div>
        </form>
      )}

      {mailSent && (
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

              <div className="flex justify-center items-center px-auto">
                <Otp
                  {...formik.getFieldProps("otp")}
                  inputOtp={handleOtpChange}
                />
                {/* <p>OTP entered: {otp}</p> */}
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
      )}
    </div>
  );
};

export default Register;
