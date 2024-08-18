import React , {useState} from "react";
import { metrix } from "../assets";
import { IoMailOutline, IoKeyOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { verifyPassword } from "../helper/helper";
import { useFormik } from "formik";
import { loginValidate } from "../helper/validate";
import { toast, Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { Button } from "@nextui-org/react";
import LoadingButton from "../components/LoadingButton";

const Login = () => {
  const navigate = useNavigate();
  const [loading , setLoading] = useState(false);

  const setUsername = useAuthStore((state) => state.setUsername);
  //const [{isLoading , apiData , serverError}] = useFetch(`/user/${username}`)

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: loginValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      console.log(loading);
      setUsername(values.username);
      console.log(values.username);
      let loginPromise = verifyPassword({
        username: values.username,
        password: values.password,
      });
      toast.promise(loginPromise, {
        loading: "Checking...",
        success: <b>Login Successfully... !</b>,
        error: <b>Could not login... !</b>,
      });

      loginPromise.then((res) => {
        try {
          let { token } = res.data.data;
          localStorage.setItem("token", token);
          setLoading(false);
          navigate("/dashboard");
        } catch (error) {
          console.error("Error extracting token:", error);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error in login:", error.error);
        setLoading(false);
        toast.error(error.error);
      });
    },
  });

  return (
    <div className="w-full font-poppins flex justify-center items-center">
      <Toaster position="top-center" reverseOrder="false"></Toaster>
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
            <div className=" w-full sm:col-span-1">
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
          </div>

          <NavLink to={"/forget-password"}>
            <p className="text-primary flex justify-end items-center pt-[4px]">
              Recover Password
            </p>
          </NavLink>
          <div className="flex justify-center items-center flex-col">
            <p className="pt-[15px]">
              Don’t have an account?
              <NavLink to={"/register"}>
                <span className="text-primary"> Sign Up </span>
              </NavLink>
            </p>
            {!loading && (
              <button
                onClick={
                  formik.handleSubmit
                }
                type="submit"
                className="bg-primary px-[20px] font-poppins py-2 mt-[20px] rounded-xl text-white text-[18px]"
              >
                Login
              </button>
            )}
            {loading && <div className="mt-[20px]"><LoadingButton /></div>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
