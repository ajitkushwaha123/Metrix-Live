import React, { useState } from "react";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { bulkUploader } from "../helper/helper";
import { FaDownload } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { Button } from "@nextui-org/react";


const BulkUpload = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const fileHandler = (e) => {
    e.preventDefault();

    setSelectedFile(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    console.log("Selected" , selectedFile);
    const uploadPromise = bulkUploader(selectedFile);
    toast.promise(uploadPromise, {
          loading: "Creating...",
          success: <b>Product Uploaded Successfully... !</b>,
          error: <b>Couldn't upload Product... !</b>,
        });

     uploadPromise.then(() => {
       toggleModal();
     });
  }

  const onButtonClick = (e) => {
    e.preventDefault();
    const csvUrl = "/assets/dummy.csv"; // Corrected the path to a CSV file
    const link = document.createElement("a");
    link.href = csvUrl;
    link.download = "dummy.csv"; // specify the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {/* Modal toggle */}
      <button
        onClick={toggleModal}
        className="block flex justify-center items-center font-poppins text-white bg-primary font-medium rounded-lg text-sm px-5 py-1.5 text-center "
        type="button"
        size="sm"
      >
        <span className="text-[21px] mr-[8px]">+</span> Bulk Upload
      </button>

      {/* Main modal */}
      {isOpen && (
        <div className="flex">
          <Toaster position="top-center" reverseOrder={false} />
          <div
            id="crud-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed shadow-lg shadow-indigo-500/40 backdrop-blur-sm bg-indigo-500/10 font-poppins top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden"
          >
            <div className="relative p-4 min-w-[350px]  max-h-full">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Bulk Upload
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={toggleModal}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* Modal body */}
                <form
                  //   onSubmit={formik.handleSubmit}
                  className="p-4 min-w-[350px] max-w-[450px] flex md:p-5"
                >
                  <div className="flex w-[90%] justify-center item-center flex-col">
                    <div className="flex justify-between items-center">
                      <h2>Data Information</h2>
                    </div>
                    <div className="my-[10px] mb-4">
                      <div className="">
                        <div className="">
                          <label
                            htmlFor="customerName"
                            className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Upload File
                          </label>
                          <input
                            type="file"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block py-2.5 px-1 md:p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Upload csv file"
                            onChange={(e) => {
                              fileHandler(e);
                            }}
                          />
                        </div>

                        <div className="text-start my-[10px]">
                          <label
                            htmlFor="phone"
                            className="block text-start text-primary mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Dummy File
                          </label>

                            <button
                              onClick={(e) => {
                                onButtonClick(e);
                              }}
                              className="text-red-400 text-start flex justify-center items-center"
                            >
                              <FaDownload className="mr-[10px]" /> Download
                            </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full justify-between items-center">
                      <button
                        onClick={toggleModal}
                        className="bg-white border-2 border-primary px-[10px] py-[5px] font-medium rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          handleSubmit(e);
                        }}
                        className="bg-primary px-[10px] py-[5px] text-white rounded-md"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkUpload;
