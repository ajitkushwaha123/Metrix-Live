import React, { useState } from "react";
import BreadCrum from "../../components/BreadCrum";
import useFetch from "../../hooks/fetch.hooks";
import { useFormik } from "formik";
import { supportRequest } from "../../helper/helper";
import toast, { Toaster } from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";
import { supportValidate } from "../../helper/validate";

const Support = () => {
  const [{ apiData }] = useFetch();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      restaurantName: apiData?.name || "",
      phoneNumber: apiData?.phone || "",
      requestType: "",
      explainIssue: "",
    },
    validate: supportValidate,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        const supportPromise = supportRequest(values);

        toast.promise(supportPromise, {
          loading: "Submitting...",
          success: "Request Submitted Successfully!",
          error: "Error Submitting request. Please try again.",
        });

        await supportPromise; 
      } catch (err) {
        // console.error("Error submitting request:", err); 
      } finally {
        setIsLoading(false); 
      }
    },
  });

  return (
    <div>
      <BreadCrum title={"Support"} back={"/"} />
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center w-[100%]">
        <div
          id="crud-modal"
          tabindex="-1"
          aria-hidden="true"
          class="justify-center items-center  md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div class="p-4 w-full max-w-md max-h-full">
            <div class="bg-white rounded-lg shadow dark:bg-gray-700">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Contact Support
                </h3>
              </div>

              <form
                onSubmit={formik.handleSubmit}
                class="p-4 text-start md:p-5"
              >
                <div class="grid gap-4 mb-4 grid-cols-2">
                  <div class="col-span-2">
                    <label
                      for="name"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      // value={apiData?.name || ""}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Enter Restaurant Name"
                      required=""
                      {...formik.getFieldProps("restaurantName")}
                    />
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <label
                      for="phone-number"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Contact Number
                    </label>
                    <input
                      type="number"
                      name="phone-number"
                      id="phone-number"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="+91"
                      required=""
                      {...formik.getFieldProps("phoneNumber")}
                    />
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <label
                      for="request-type"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Request Type
                    </label>
                    <select
                      {...formik.getFieldProps("requestType")}
                      id="category"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option selected="">Select category</option>
                      <option value="request-feature">Request Feature</option>
                      <option value="chat-support">Chat Support</option>
                      <option value="bug-report">Bug Report</option>
                      <option value="request-call-back">
                        Request Call Back
                      </option>
                    </select>
                  </div>
                  <div class="col-span-2">
                    <label
                      for="explain-issue"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Explain Issue
                    </label>
                    <textarea
                      {...formik.getFieldProps("explainIssue")}
                      id="explain-issue"
                      rows="4"
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write about issue you are facing... !"
                      required=""
                    ></textarea>
                  </div>
                </div>
                {!isLoading ? (
                  <button
                    type="submit"
                    class="text-white inline-flex items-center bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      class="me-1 -ms-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    Submit Request
                  </button>
                ) : (
                  <LoadingButton />
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
