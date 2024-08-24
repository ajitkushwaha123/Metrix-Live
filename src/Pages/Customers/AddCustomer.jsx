import React, { useState, useEffect } from "react";
import CustomerSearch from "../../components/CustomerSearch";
import axios from "axios";
import { useFormik } from "formik";
import { CiSearch } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import { createOrderValidate } from "../../helper/validate";
import { Avatar , Button } from "@nextui-org/react";
import { addCustomers } from "../../helper/helper";
import LoadingButton from "../../components/LoadingButton";

const NewCustomer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState(false);
  const [cartProduct, setCartProduct] = useState([]);
  const [cart, setCart] = useState(false);
  const [image , setImage] = useState('');
  const [selected , setSelected] = useState(false);
  const [color , setColor] = useState('');

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const [quantities, setQuantities] = useState({});
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchProducts = async () => {
    // setLoading(true);
    try {
      const response = await getProd();
      setProducts(response.data);
      // setLoading(false);
    } catch (error) {
      setError(error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCustomer = () => {
    setNewCustomer((prevState) => !prevState);
    console.log(!newCustomer);
  };

  const handleCustomers = async (values) => {
    setLoading(true);
    try {
      const  data  = await addCustomers(values)

      console.log("Customer Added", data);
      setLoading(false);
      return Promise.resolve({ customer: data });
    } catch (err) {
      console.error("Error adding customer :", err.message);
      setLoading(false);
      return Promise.reject({ err: err.message });
    }
  };

  const formik = useFormik({
    initialValues: {
      customerName: "Ajit Kushwaha",
      phone: "8178739633",
      status: "active",
      customerImage: "",
      imageColor: "",
    },
    validate: createOrderValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        values.customerImage = image;
        values.imageColor = color;
        let customerPromise = handleCustomers(values);
        toast.promise(customerPromise, {
          loading: "Creating...",
          success: <b>Customer Created Successfully... !</b>,
          error: <b>Couldn't Create Customer... !</b>,
        });

        formik.resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

    const users = [
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png", color: "tertiary" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png", color: "default" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png", color: "primary" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png", color: "tertiary" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png", color: "success" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png", color: "warning" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png", color: "danger" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png", color: "default" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png", color: "primary" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png", color: "tertiary" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/7.png", color: "success" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/8.png", color: "warning" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/8.png", color: "danger" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/9.png", color: "default" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/9.png", color: "primary" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/11.png", color: "tertiary" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/11.png", color: "success" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/12.png", color: "warning" },
  { img: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/12.png", color: "danger" }
];

const handleImage = (e, user) => {
  e.preventDefault();
  // alert(e.target.src); 
  setImage(e.target.src); 
  setColor(user.color);
  setSelectedUser(user); 
  setSelected(true);
  console.log(image);
  toast.success("Image Selected Successfully ...!")
};


  return (
    <>
      {/* Modal toggle */}
      <button
        onClick={toggleModal}
        className="block flex justify-center items-center font-poppins text-white bg-primary font-medium rounded-lg text-sm px-5 py-1.5 text-center "
        type="button"
        size="sm"
      >
        <span className="text-[21px] mr-[8px]">+</span> Add Customer
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
            <div className="relative p-4 min-w-[350px] max-w-[450px] max-h-full">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {newCustomer ? "Update Customer" : "Add a Customer"}
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
                  onSubmit={formik.handleSubmit}
                  className="p-4  flex md:p-5"
                >
                  <img src={selected.img} />
                  <div className="flex w-[100%] justify-center item-center flex-col">
                    <div className="flex justify-between items-center">
                      <h2>Customer Information</h2>
                      {/* <h2
                        onChange={(e) => handleCustomer(e)}
                        className="flex ml-[20px] justify-center items-center"
                      >
                        Update Customer
                        <input
                          className="ml-[10px] px-[10px]"
                          type="checkbox"
                          checked={newCustomer}
                          onChange={(e) => handleCustomer}
                        />
                      </h2> */}
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
                              {...formik.getFieldProps("customerName")}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Customer Name"
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
                        onClick={toggleModal}
                        className="bg-white border-2 border-primary px-[10px] py-[5px] font-medium rounded-md"
                      >
                        Cancel
                      </button>
                      {loading === true ? (
                        <LoadingButton />
                      ) : (
                        <button className="bg-primary px-[10px] py-[5px] text-white rounded-md">
                          {newCustomer ? "Update Customer" : "Add Customer"}
                        </button>
                      )}
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

export default NewCustomer;
