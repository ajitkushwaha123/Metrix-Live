import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { imageUploader } from "../../helper/helper"; 
import { useNavigate } from "react-router-dom";
import ItemTable from "./ItemTable"; 
import LoadingButton from "../../components/LoadingButton";

const AiUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [itemData, setItemData] = useState([]);
  const [bulk , setBulk] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileHandler = (e) => {
    e.preventDefault();
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    } else if (!selectedFile.name.match(/\.(jpg|jpeg|png|webp|pdf)$/)) {
      toast.error("Only png, webp, jpeg images are allowed");
      return;
    }

    setLoading(true);

    try {
      const uploadPromise = imageUploader(selectedFile);

      toast.promise(uploadPromise, {
        loading: "Fetching Data ...",
        success: "Data Fetched Successfully... !",
        error: "Error Fetching details from image !.",
      });
      
      const res = await uploadPromise;

      console.log("Upload response:", res?.response?.data);
      setItemData(res?.response?.data);

      setLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred during upload. Please try again.");

      setLoading(false);
    }
  };

  const bulkUpload = (e) => {
    e.preventDefault();
    setBulk((prevState) => !prevState);
  }

  return (
    <>
        <div>
          <Toaster position="top-center" reverseOrder={true}></Toaster>
          {itemData?.length === 0 && (
            <div className="my-[10px] bg-white rounded-md mb-4">
              <div className="flex mb-[20px] items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Upload
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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

              <div className="px-[20px] pb-[20px]">
                <div className="">
                  <label
                    htmlFor="customerName"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Upload Menu
                  </label>
                  <input
                    type="file"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block py-2.5 px-1 md:p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Upload csv file"
                    onChange={(e) => {
                      fileHandler(e);
                    }}
                  />

                  <div className="flex mt-[25px] w-full justify-center items-center">
                    {/* <button
                      onClick={(e) => {
                        bulkUpload(e);
                      }}
                      className="bg-white border-2 border-primary px-[10px] py-[5px] font-medium rounded-md"
                    >
                      Cancel
                    </button> */}

                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <button
                        onClick={(e) => {
                          handleSubmit(e);
                        }}
                        className="bg-primary px-[10px] py-[5px] text-white rounded-md"
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {itemData?.length > 0 && <ItemTable data={itemData} />}
        </div>
    </>
  );
};

export default AiUpload;
