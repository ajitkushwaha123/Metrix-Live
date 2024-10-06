import { useFormik } from "formik";
import React, { useState } from "react";
import { LuWifiOff } from "react-icons/lu";
import { updateOrder as updateOrderHelper } from "../helper/helper";
import toast , {Toaster} from 'react-hot-toast';
import { BsBox } from "react-icons/bs";

const RejectionModal = ({ isOpen = false, orderId }) => {
  const [open, setOpen] = useState(isOpen);
  const [orderedStatus, setOrderedStatus] = useState("pending");

  const updateOrder = async (id, values) => {
    try {
      const { data } = await updateOrderHelper(`${id}`, values);
      console.log("Updated order data:", data);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      orderStatus: "pending",
      orderRejectionReason: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values.orderStatus = "cancelled";
      console.log("valll", values);

      try {
        let updateOrderPromise = updateOrder(orderId, values);
        toast.promise(updateOrderPromise, {
          loading: "Cancelling ...",
          success: <b>Order Cancelled Successfully!</b>,
          error: <b>Error Cancelling Order!</b>,
        });

        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <>
      {open ? (
        <div>
          <div
            id="popup-modal"
            tabIndex="-1"
            className="fixed inset-0 flex items-center justify-center overflow-y-auto shadow-lg shadow-indigo-500/40 backdrop-blur-sm bg-indigo-500/10"
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  onClick={() => setOpen(false)}
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="popup-modal"
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <BsBox className="mx-auto mb-4 text-danger-400 w-12 h-12 dark:text-danger-200" />
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Enter a reason for rejecting the order ?
                  </h3>

                  <input
                    type="text"
                    className="w-full px-2 py-2.5 mb-[25px] text-sm font-medium text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800"
                    placeholder="Enter reason"
                    {...formik.getFieldProps("orderRejectionReason")}
                  />
                  <button
                    onClick={formik.handleSubmit}
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  >
                    Reject Order
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    data-modal-hide="popup-modal"
                    type="button"
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-100 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default RejectionModal;
