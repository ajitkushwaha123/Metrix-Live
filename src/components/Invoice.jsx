import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import useFetch from "../hooks/fetch.hooks";
import { FaRegShareSquare } from "react-icons/fa";
import { ImWhatsapp } from "react-icons/im";
import { NavLink, redirect } from "react-router-dom";
import { TbFileInvoice } from "react-icons/tb";
import { getSingleOrders } from "../helper/helper";
import { useNavigate , Navigate } from "react-router-dom";
import PriceFormatter from "../helper/priceFormatter";


const Invoice = ({ btnText = "Inovice" , orderId}) => {
  console.log("dd" , orderId);
  const [{ isLoading, apiData, serverError }] = useFetch();
  const [isOpen, setIsOpen] = useState(false);
  const [share, setShare] = useState(false);
    const [id, setId] = useState(orderId);
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState("");
    const [orderNote, setOrderNote] = useState("");
    const [quantity, setQuantity] = useState("");
    const [orderType, setOrderType] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [invoiceId , setInvoiceId] = useState("");
    const [taxes , setTaxes] = useState(0);
    const [discount , setDiscount] = useState(0);
    const [discountType , setDiscountType] = useState("absolute");

  const fetchProduct = async (id) => {
    try {
      console.log("Fetching product with id:", id);
      const product = await getSingleOrders(`orders/find/${id}`);
      console.log("Fetched productttttttttt:", product);

      // Format the date
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = new Date(product?.createdAt).toLocaleDateString(
        "en-US",
        options
      );

      setCustomerName(product.customerName);
      setPhone(product.phone);
      setPaymentType(product.paymentType);
      setPrice(product.price);
      setStatus(product.status);
      setOrderNote(product.orderNote);
      setQuantity(product.quantity);
      setOrderType(product.orderType);
      setOrderDate(formattedDate);
      setInvoiceId(product.invoiceId || "");
      setDiscount(product.discount || 0);
      setDiscountType(product.discountType || 0);
      setTaxes(product.tax || 0);
      console.log("df" , product.tax);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const toggleModal = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    console.log("Modal toggled");
    setShare(false);
  };

  const handleShare = (e) => {
    e.preventDefault();
    setShare(!share);
    console.log("Share toggled");
  };

  useEffect(() => {
    if(id != "")
    {
        fetchProduct(id);
    }
  } , [id])

  const navigate = useNavigate();

  const handleDownload = (e) => {
    e.preventDefault();
    const url = `http://localhost:8000/api/invoice/invoice/${invoiceId}`;
    alert(url);
    window.location.href = url;
    // window.open(url);
  };

  const phoneNumber = phone; // Replace with the target number  
  const message = "Here is bill of recent order !.";  
  const pdfLink = `http://localhost:8000/api/invoice/invoice/${invoiceId}`; // Replace with your PDF link  

  const handleClick = () => {  
    const encodedMessage = encodeURIComponent(`${message} ${pdfLink}`);  
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`);  
  };  

  return (
    <>
      {/* Modal toggle */}
      <button
        onClick={(e) => {
          toggleModal(e);
        }}
      >
        <a className="inline-flex items-center" href="#">
          <TbFileInvoice />
          {btnText === "" && <div></div>}
          {btnText !== "" && <span className="ml-[10px]">{btnText}</span>}
        </a>
      </button>

      {/* Main modal */}
      {isOpen && (
        <div className="flex">
          <Toaster position="top-center" reverseOrder={false} />
          <div
            id="crud-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="custom-sidebar fixed shadow-lg shadow-indigo-500/40 backdrop-blur-sm bg-indigo-500/10 font-poppins top-0 right-0 left-0 z-50 flex justify-center items-center customer-image custom-sidebar chalaja w-full h-full overflow-y-auto overflow-x-hidden"
          >
            <div className="relative pb-[10px] max-w-[540px] my-[40px] p-4 max-h-full">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    View Order Details
                  </h3>
                  <button
                    // type="button"
                    className="text-gray-400 z-100 bg-red-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={(e) => {
                      toggleModal(e);
                    }}
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
                  </button>
                </div>

                {share === false && (
                  <form>
                    <span className="mx-auto -mt-[30px] flex justify-center items-center size-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                      {apiData?.profile ? (
                        <img
                          className="rounded-full w-[62px] h-[62px] object-cover"
                          src={apiData.profile}
                          alt="Profile"
                        />
                      ) : (
                        <svg
                          className="shrink-0 size-6"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                          <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                        </svg>
                      )}
                    </span>

                    <div className="p-4 sm:p-7 overflow-y-auto">
                      <div className="text-center">
                        <h3
                          id="hs-ai-modal-label"
                          className="text-lg font-semibold text-gray-800 dark:text-neutral-200"
                        >
                          Invoice from {apiData?.name || "Nancy Shop"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                          Invoice #3682303
                        </p>
                      </div>

                      <div className="mt-5 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 gap-5">
                        <div>
                          <span className="block text-xs uppercase text-gray-500 dark:text-neutral-500">
                            Bill Value :
                          </span>
                          <span className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
                            <PriceFormatter price={price} />
                          </span>
                        </div>

                        <div>
                          <span className="block text-xs uppercase text-gray-500 dark:text-neutral-500">
                            Date paid:
                          </span>
                          <span className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {orderDate}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs uppercase text-gray-500 dark:text-neutral-500">
                            Payment method:
                          </span>
                          <div className="flex text-center justify-center gap-x-2">
                            <svg
                              className="size-5"
                              width="400"
                              height="248"
                              viewBox="0 0 400 248"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0)">
                                <path
                                  d="M254 220.8H146V26.4H254V220.8Z"
                                  fill="#FF5F00"
                                />
                                <path
                                  d="M152.8 123.6C152.8 84.2 171.2 49 200 26.4C178.2 9.2 151.4 0 123.6 0C55.4 0 0 55.4 0 123.6C0 191.8 55.4 247.2 123.6 247.2C151.4 247.2 178.2 238 200 220.8C171.2 198.2 152.8 163 152.8 123.6Z"
                                  fill="#EB001B"
                                />
                                <path
                                  d="M400 123.6C400 191.8 344.6 247.2 276.4 247.2C248.6 247.2 221.8 238 200 220.8C228.8 198.2 247.2 163 247.2 123.6C247.2 84.2 228.8 49 200 26.4C221.8 9.2 248.6 0 276.4 0C344.6 0 400 55.4 400 123.6Z"
                                  fill="#F79E1B"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0">
                                  <rect
                                    width="400"
                                    height="247.2"
                                    fill="white"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            <span className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {paymentType}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-10">
                        <h4 className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Summary
                        </h4>

                        <ul className="mt-3 flex flex-col">
                          <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                            <div className="flex items-center justify-between w-full">
                              <span>Payment to Front</span>
                              <span>
                                {" "}
                                <PriceFormatter price={price} />{" "}
                              </span>
                            </div>
                          </li>
                          {discount !== 0 && (
                            <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                              <div className="flex items-center justify-between w-full">
                                <span>Discount</span>
                                <span>
                                  -{" "}
                                  {discountType === "percentage" ? (
                                    <PriceFormatter
                                      price={(price * discount) / 100}
                                    />
                                  ) : (
                                    <PriceFormatter price={discount} />
                                  )}
                                </span>
                              </div>
                            </li>
                          )}
                          {taxes !== 0 && (
                            <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                              <div className="flex items-center justify-between w-full">
                                <span>Tax fee</span>
                                <span>
                                  +{" "}
                                  <PriceFormatter
                                    price={(price * taxes) / 100}
                                  />
                                </span>
                              </div>
                            </li>
                          )}
                          <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
                            <div className="flex items-center justify-between w-full">
                              <span>Amount paid</span>
                              {discountType === "percentage" ? (
                                <span>
                                  {" "}
                                  <PriceFormatter
                                    price={
                                      price +
                                      (price * taxes) / 100 -
                                      (discount * price) / 100
                                    }
                                  />
                                </span>
                              ) : (
                                <span>
                                  {" "}
                                  <PriceFormatter
                                    price={
                                      price + (price * taxes) / 100 - discount
                                    }
                                  />
                                </span>
                              )}
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5 flex justify-end gap-x-2">
                        <a
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                          href="#"
                          onClick={(e) => handleShare(e)}
                        >
                          <FaRegShareSquare />
                          Share
                        </a>
                        <NavLink
                          to={`http://localhost:8000/api/invoice/invoice/${invoiceId}`}
                        >
                          <button>
                            <a
                              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              onClick={(e) => {
                                handleDownload(e);
                              }}
                            >
                              <svg
                                className="shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" x2="12" y1="15" y2="3" />
                              </svg>
                              Download Bill
                            </a>
                          </button>
                        </NavLink>
                        {/* <a
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                          href={`http://localhost:8000/api/invoice/invoice/${invoiceId}`}
                        >
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect width="12" height="8" x="6" y="14" />
                          </svg>
                          Print
                        </a> */}
                      </div>

                      <div className="mt-5 sm:mt-10">
                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                          If you have any questions, please contact us at{" "}
                          <a
                            className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                            href="#"
                          >
                            {apiData?.email || "example@site.com"}
                          </a>{" "}
                          or call at{" "}
                          <a
                            className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                            href="tel:+1898345492"
                          >
                            {apiData?.phone || "+1 898-34-5492"}
                          </a>
                        </p>
                      </div>
                    </div>
                  </form>
                )}
                {share === true && (
                  <div>
                    <div className="w-full max-w-md bg-white shadow-lg rounded-lg px-4 pb-6 relative">
                      <div className="my-3">
                        <h6 className="text-base text-gray-800">
                          Share this link via
                        </h6>

                        <div className="flex justify-center items-center flex-wrap gap-4 mt-4">
                          <NavLink to={"https://wa.me/918178739633"}>
                            <button
                              type="button"
                              onClick={handleClick}
                              className="w-10 h-10 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#25D366] hover:bg-green-500 active:bg-green-700"
                            >
                              <ImWhatsapp />
                            </button>
                          </NavLink>
                          {/* <button
                            type="button"
                            className="w-10 h-10 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#03a9f4] hover:bg-[#03a1f4] active:bg-[#03a9f4]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20px"
                              fill="#fff"
                              viewBox="0 0 512 512"
                            >
                              <path
                                d="M512 97.248c-19.04 8.352-39.328 13.888-60.48 16.576 21.76-12.992 38.368-33.408 46.176-58.016-20.288 12.096-42.688 20.64-66.56 25.408C411.872 60.704 384.416 48 354.464 48c-58.112 0-104.896 47.168-104.896 104.992 0 8.32.704 16.32 2.432 23.936-87.264-4.256-164.48-46.08-216.352-109.792-9.056 15.712-14.368 33.696-14.368 53.056 0 36.352 18.72 68.576 46.624 87.232-16.864-.32-33.408-5.216-47.424-12.928v1.152c0 51.008 36.384 93.376 84.096 103.136-8.544 2.336-17.856 3.456-27.52 3.456-6.72 0-13.504-.384-19.872-1.792 13.6 41.568 52.192 72.128 98.08 73.12-35.712 27.936-81.056 44.768-130.144 44.768-8.608 0-16.864-.384-25.12-1.44C46.496 446.88 101.6 464 161.024 464c193.152 0 298.752-160 298.752-298.688 0-4.64-.16-9.12-.384-13.568 20.832-14.784 38.336-33.248 52.608-54.496z"
                                data-original="#03a9f4"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="w-10 h-10 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#0077b5] hover:bg-[#0055b5] active:bg-[#0077b5]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20px"
                              fill="#fff"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M23.994 24v-.001H24v-8.802c0-4.306-.927-7.623-5.961-7.623-2.42 0-4.044 1.328-4.707 2.587h-.07V7.976H8.489v16.023h4.97v-7.934c0-2.089.396-4.109 2.983-4.109 2.549 0 2.587 2.384 2.587 4.243V24zM.396 7.977h4.976V24H.396zM2.882 0C1.291 0 0 1.291 0 2.882s1.291 2.909 2.882 2.909 2.882-1.318 2.882-2.909A2.884 2.884 0 0 0 2.882 0z"
                                data-original="#0077b5"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="w-10 h-10 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#ea0065] hover:bg-[#ea0065d6] active:bg-[#ea0065]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20px"
                              fill="#fff"
                              viewBox="0 0 512 512"
                            >
                              <path
                                d="M301 256c0 24.852-20.148 45-45 45s-45-20.148-45-45 20.148-45 45-45 45 20.148 45 45zm0 0"
                                data-original="#000000"
                              />
                              <path
                                d="M332 120H180c-33.086 0-60 26.914-60 60v152c0 33.086 26.914 60 60 60h152c33.086 0 60-26.914 60-60V180c0-33.086-26.914-60-60-60zm-76 211c-41.355 0-75-33.645-75-75s33.645-75 75-75 75 33.645 75 75-33.645 75-75 75zm86-146c-8.285 0-15-6.715-15-15s6.715-15 15-15 15 6.715 15 15-6.715 15-15 15zm0 0"
                                data-original="#000000"
                              />
                              <path
                                d="M377 0H135C60.562 0 0 60.563 0 135v242c0 74.438 60.563 135 135 135h242c74.438 0 135-60.563 135-135V135C512 60.562 451.437 0 377 0zm45 332c0 49.625-40.375 90-90 90H180c-49.625 0-90-40.375-90-90V180c0-49.625 40.375-90 90-90h152c49.625 0 90 40.375 90 90zm0 0"
                                data-original="#000000"
                              />
                            </svg>
                          </button> */}
                        </div>
                      </div>

                      <div>
                        <h6 className="text-base text-gray-800">
                          Or copy link
                        </h6>
                        <div className="w-full rounded-lg overflow-hidden border border-gray-300 flex items-center mt-4">
                          <p className="text-sm text-gray-500 flex-1 ml-4">
                            https://localhost.com:8000/api/invoice/invoice/
                            {invoiceId}
                          </p>
                          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm text-white">
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Invoice;
