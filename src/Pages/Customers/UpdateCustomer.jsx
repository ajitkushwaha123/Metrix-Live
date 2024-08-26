import React, { useState, useEffect } from "react";
import CustomerSearch from "../../components/CustomerSearch";
import axios from "axios";
import { useFormik } from "formik";
import { CiSearch } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import { createOrderValidate } from "../../helper/validate";
import { Avatar } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleCustomer, handleCustomers } from "../../helper/helper";

const UpdateCustomer = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(true);
  const [newCustomer, setUpdateCustomer] = useState(false);
  const [cartCustomer, setCartCustomer] = useState([]);
  const [cart, setCart] = useState(false);
  const [image, setImage] = useState("");
  const [selected, setSelected] = useState(false);
  const [color, setColor] = useState("");
  const [customer, setCustomer] = useState([]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  const [quantities, setQuantities] = useState({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        console.log("id", id);
        const { data } = await getSingleCustomer(id);
        console.log("product", data);
        setCustomer(data);
        setImage(data.customerImage);
        setColor(data.imageColor);
      } catch (error) {
        console.error("Error fetching Customer:", error);
      }
    };

    fetchCustomer();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      customerName: customer.customerName,
      phone: customer.phone,
      status: customer.status,
      customerImage: image,
      imageColor: color,
    },
    enableReinitialize: true, // Add this line
    validate: createOrderValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log("values", values);
      let addCustomerPromise = handleCustomers(values, id);
      toast.promise(addCustomerPromise, {
        loading: "Creating...",
        success: <b>Customer Added Successfully... !</b>,
        error: <b>Error Creating Customer... !</b>,
      });

      addCustomerPromise.then(function () {
        navigate("/customer");
      });
    },
  });

  const users = [
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
      color: "tertiary",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png",
      color: "default",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png",
      color: "primary",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
      color: "tertiary",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png",
      color: "success",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png",
      color: "warning",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png",
      color: "danger",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png",
      color: "default",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png",
      color: "primary",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png",
      color: "tertiary",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/7.png",
      color: "success",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/8.png",
      color: "warning",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/8.png",
      color: "danger",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/9.png",
      color: "default",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/9.png",
      color: "primary",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/11.png",
      color: "tertiary",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/11.png",
      color: "success",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/12.png",
      color: "warning",
    },
    {
      img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/12.png",
      color: "danger",
    },
  ];

  const handleImage = (e, user) => {
    e.preventDefault();
    // alert(e.target.src);
    setImage(e.target.src);
    setColor(user.color);
    setSelectedUser(user);
    setSelected(true);
    console.log(image);
    toast.success("Image Selected Successfully ...!");
  };

  const cancelUpdate = () => {
    navigate("/customer");
  };

  return (
    <>
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
            <div className="relative p-4 min-w-[350px] max-w-[450px] max-h-full">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Update Customer
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={cancelUpdate}
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
                  onSubmit={formik.handleSubmit}
                  className="p-4  flex md:p-5"
                >
                  <img src={selected.img} />
                  <div className="flex w-[100%] justify-center item-center flex-col">
                    <div className="flex justify-between items-center">
                      <h2>Customer Information</h2>
                    </div>
                    <div className="my-[10px] mb-4">
                      {newCustomer && (
                        <div className="">
                          <CustomerSearch />
                        </div>
                      )}
                      {!newCustomer && (
                        <div className="">
                          <div className=" pt-[10px]">
                            <label
                              htmlFor="customerName"
                              className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Select Profile
                            </label>

                            <div className="custom-image flex overflow-x-scroll py-[10px] px-[7px] gap-4 w-auto">
                              {users.map((user, index) => (
                                <div
                                  onClick={(e) => handleImage(e, user)} // Pass the user object to handleImage
                                  key={index}
                                >
                                  <Avatar
                                    isBordered
                                    color={user.color}
                                    src={user.img}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="">
                            <label
                              htmlFor="customerName"
                              className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Customer Name
                            </label>
                            <input
                              type="text"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Customer Name"
                              {...formik.getFieldProps("customerName")}
                              // required
                            />
                          </div>

                          <div className=" my-[10px]">
                            <label
                              htmlFor="phone"
                              className="block text-start text-primary mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Phone
                            </label>
                            <input
                              {...formik.getFieldProps("phone")}
                              type="number"
                              name="phone"
                              id="phone"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="+91-"
                              // required
                            />
                          </div>
                        </div>
                      )}

                      <div className="">
                        <label
                          htmlFor="Customer Status"
                          className="block mb-2 text-start text-primary text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Customer Status
                        </label>
                        <select
                          {...formik.getFieldProps("status")}
                          id="Customer Status"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option selected>Select Customer Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">In-Active</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={cancelUpdate}
                        className="bg-white border-2 border-primary px-[10px] py-[5px] font-medium rounded-md"
                      >
                        Cancel
                      </button>
                      <button className="bg-primary px-[10px] py-[5px] text-white rounded-md">
                        Update Customer
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

export default UpdateCustomer;
