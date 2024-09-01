import React, { useState } from "react";
import PriceFormatter from "../helper/priceFormatter";

const Variant = ({ variant, productName, onVariantSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleVariantClick = (item) => {
    setIsOpen(false);
    onVariantSelect(item.value); 
    console.log(item.value);
  };

  return (
    <div>
      <button
        className="h-[80px] bg-white overflow-x-scroll chalaja flex justify-center items-center flex-col p-4 rounded-md text-start"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Select variant for ${productName}`}
      >
        {productName}
      </button>

      {isOpen && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative mx-[20px] bg-white p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Select Variant
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close modal"
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

              <div className="p-4 md:p-5 space-y-4">
                <div className="grid cursor-pointer grid-cols-2 md:grid-cols-4 gap-4">
                  {variant?.map(
                    (item, index) =>
                      ((item.variant !== "" || item.value !== 0) && (item.variant && item.value)) && (
                        <div
                          key={index}
                          onClick={() => handleVariantClick(item)}
                          className="h-[80px] bg-[#EEF0FA] overflow-x-scroll chalaja flex justify-center items-center flex-col p-4 rounded-md text-start"
                        >
                          <div>{item.variant}</div>
                          <div>
                            {item.value !== 0 && (
                              <PriceFormatter price={item.value} />
                            )}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Variant;
