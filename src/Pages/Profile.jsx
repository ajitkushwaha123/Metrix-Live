import React, { useState } from "react";
import { useFormik } from "formik";
import { loginValidate, profileValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { loader } from "../assets";
import { useAuthStore } from "../store/store";
import { updateUser } from "../helper/helper";
import useFetch from "../hooks/fetch.hooks";
import convertToBase64 from "../helper/convert";
import { Button } from "@nextui-org/react";

const Profile = () => {
  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const [loading , setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: apiData?.name || "",
      email: apiData?.email || "",
      phone: apiData?.phone || "",
      address: apiData?.address || "",
      city: apiData?.city || "",
      profile: apiData?.profile || "",
    },
    enableReinitialize: true,
    validate: profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      values = await Object.assign(values, { profile: file || "" });
      let updatePromise = updateUser(values);
     
      toast.promise(updatePromise, {
        loading: "Updating...",
        success: <b>Update Successfully... !</b>,
        error: <b>Could not update... !</b>,
      });

      updatePromise.then(() => {
        setLoading(false);
        toast.success("Sync Data in Progress")
        window.location.reload();
      })

      // setLoading(false);
      console.log(apiData?.email);
      console.log("userData", values);
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <>
      {loading ? (
        <div>
          <img src={loader} />
        </div>
      ) : (
        <div className="font-poppin py-[20px] flex items-center justify-center">
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-[380px] bg-white mx-[20px] rouned-xl py-[20px] shadow-lg w-[100%] px-[20px]"
          >
            <Toaster position="top-center" reverseOrder="false"></Toaster>
            <div className="">
              <div className="rounded-xl w-[100%] flex items-center flex-col justify-center">
                <div className="w-[150px] md:w-[170px] md:h-[170px] h-[150px]">
                  <label htmlFor="profile">
                    <img
                      name="profile"
                      className="rounded-full w-[150px] h-[150px] md:w-[170px] md:h-[170px] object-cover"
                      src={
                        file ||
                        apiData?.profile ||
                        "https://i.pinimg.com/564x/44/27/2d/44272df32b1b832c9ea8f596fb4d76b2.jpg"
                      }
                    />
                    <input
                      className="hidden"
                      onChange={onUpload}
                      type="file"
                      id="profile"
                    />
                  </label>
                </div>

                <div className=" w-full sm:col-span-1">
                  <label
                    htmlFor="name"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("name")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Name"
                  />
                </div>

                <div className=" w-full sm:col-span-1 mt-[15px]">
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
                    readOnly
                  />
                </div>

                <div className=" w-full sm:col-span-1 mt-[15px]">
                  <label
                    htmlFor="phone"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("phone")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Phone"
                  />
                </div>

                <div className=" w-full sm:col-span-1 mt-[15px]">
                  <label
                    htmlFor="address"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("address")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Address"
                  />
                </div>

                <div className=" w-full sm:col-span-1 mt-[15px]">
                  <label
                    htmlFor="city"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("city")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter City"
                  />
                </div>

                {!loading && (
                  <button
                    onClick={() => {
                      setLoading(true), formik.handleSubmit();
                    }}
                    type="submit"
                    className="bg-primary mt-[20px] rounded-lg text-white px-6 text-[18px] py-2"
                  >
                    Update
                  </button>
                )}
                {loading && (
                  <div className="mt-[20px]">
                    <Button color="primary" isLoading>
                      Loading
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Profile;
