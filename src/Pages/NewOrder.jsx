import React, { useState, useEffect } from "react";
import axios from "axios";
import { insert, useFormik } from "formik";
import { CiSearch } from "react-icons/ci";
import toast , {Toaster} from 'react-hot-toast';
import { createOrderValidate } from "../helper/validate";
import { addCustomers, getAllProducts, insertOrders } from "../helper/helper";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { getAllCustomers , searchProduct } from "../helper/helper";
import { Button } from "@nextui-org/react";

const NewOrder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState(false);
  const [cartProduct, setCartProduct] = useState([]);
  const [cart , setCart] = useState(false);

  const [customer, setCustomer] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState("");
  const [selectCustomerName , setSelectCustomerName] = useState("");
  const [selectCustomerPhone , setSelectCustomerPhone] = useState("");
  const [selectCustomerSince , setSelectCustomerSince] = useState("");
  const [selectedOrder , setSelectedOrder] = useState([]);

  console.log("Customer data", selectCustomer);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomers(); 
        setCustomer(response);
        console.log("Customer data fetched successfully", response);
      } catch (error) {
        console.log("Error while fetching customer data", error);
      }
    };

    fetchCustomers();
  }, []);
  
  const AddedProduct = [];
  console.log(AddedProduct);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const [quantities, setQuantities] = useState({});
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkout , setCheckout] = useState(false); 


 const handleOrder = async (values) => {
   console.log("Order Added", values.products);

    const response = await insertOrders(values);
    console.log("Order Added", response);
    return response;
 };


  const viewCart = (e) => {
    e.preventDefault();
    setCart(!cart);
    console.log("View Cart");
    setCartProduct(AddedProduct);

    console.log("Cart Product");
  
    console.log("Cart Product00000", cartProduct);
  };

const formik = useFormik({
  initialValues: {
    customerName: "",
    phone: "",
    price: 2999,
    paymentType: "Cash",
    orderStatus: "pending",
    orderNote: "",
    products: [], // Initialize with an empty array
    quantity: 0,
    customerImage: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
    imageColor: "tertiary",
    customerId: "",
    orderType: "dineIn",
    customerSince : "",
  },
  // validate: createOrderValidate,
  validateOnBlur: false,
  validateOnChange: false,
  onSubmit: async (values) => {
    values.products = cartProduct;
    if (values.products == 0) {
      values.products = AddedProduct;
    }
    console.log("Added Products", cartProduct);

    console.log("Form Valuesssssssss", values.products);

    console.log("sdfd" , selectCustomerSince);

    try {
      if (cartProduct == []) {
        toast.error("Add Products to Cart... !");
      } else {
        if (selectCustomer !== "") {
          values.customerId = selectCustomer;
          values.customerName = selectCustomerName;
          values.phone = selectCustomerPhone;
          values.customerSince = selectCustomerSince;
        } else {
          console.log("New Customer");
          let customerPromise = await addCustomers(values);

          console.log("Customer ID", customerPromise.customer._id);
          values.customerId = customerPromise.customer._id;
        }

        console.log("Updated values:", values);

        let orderPromise = handleOrder(values);
        toast.promise(orderPromise, {
          loading: "Creating...",
          success: <b>Order Created Successfully... !</b>,
          error: <b>Couldn't Create Order... !</b>,
        });

        formik.resetForm();
        AddedProduct.forEach((product) => {
          setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [product.product._id]: 0,
          }));
        });
        setCartProduct([]);
        setCart(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  },
});

 const updateTotalCartValue = () => {
   let totalQuantity = 0;
   const total = products
     .reduce((total, product) => {
       const quantity = quantities[product._id] || 0;
       totalQuantity += quantity;
       return total + product.price * quantity;
     }, 0)
     .toFixed(2);
    formik.setFieldValue("price", total);
   formik.setFieldValue("quantity", totalQuantity);
 };

  const viewCheckout = (e) => {
    e.preventDefault();
    setSelectedOrder(AddedProduct);
    formik.setFieldValue("products", AddedProduct);
    console.log("View Checkout" , AddedProduct);
    console.log("View Checkout");
    setCheckout(!checkout);
  }

   useEffect(() => {
     updateTotalCartValue();
   }, [quantities]);


  const fetchProducts = async () => {
    setLoading(true);

    const response = await getAllProducts();
    console.log("Productstedddddddddd", response.data);
    setProducts(response.data);
    setLoading(false);
  };

    const addItem = (event, productId) => {
      event.preventDefault();
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: (prevQuantities[productId] || 0) + 1,
      }));
    };

    const deleteItem = (event, productId) => {
      event.preventDefault();
      setQuantities((prevQuantities) => {
        const newQuantities = { ...prevQuantities };
        if (newQuantities[productId] > 0) {
          newQuantities[productId] -= 1;
        }
        return newQuantities;
      });
    };

    useEffect(() => {
      fetchProducts();
    }, []);

    const searchProducts = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      console.log("Search Query", query);

      try {
        const response = await searchProduct(query);
        console.log("searchhhhhh", response.data);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    const handleCustomer = () => {
      setNewCustomer((prevState) => !prevState);
      console.log(!newCustomer);
    };

  return (
    <>
      {/* Modal toggle */}
      <button
        onClick={toggleModal}
        className="block font-poppins text-white bg-primary font-medium rounded-lg text-sm md:px-5 py-1 md:py-1.5 text-center "
        type="button"
        size="sm"
      >
        Create Order
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
            <div className="relative pb-[10px] my-[40px] p-4 max-h-full">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Create New Order
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
                  className="p-4  flex flex-col md:flex-row md:p-5"
                >
                  <div className="flex hidden md:block flex-col w-[100%] md:w-[50%] justify-center item-center ">
                    <div className="flex justify-between items-center">
                      <h2>Order Details</h2>
                      <h2
                        onChange={(e) => handleCustomer(e)}
                        className="flex justify-center items-center"
                      >
                        Existing
                        <span className="hidden md:block">Customer</span>
                        <input
                          className="ml-[10px] px-[10px]"
                          type="checkbox"
                          checked={newCustomer}
                          onChange={(e) => handleCustomer}
                        />
                      </h2>
                    </div>
                    <div className="grid gap-4 my-[10px] mb-4 grid-cols-2">
                      {newCustomer && (
                        <div className="col-span-2">
                          <Select
                            items={customer}
                            label="Select a Customer"
                            placeholder="Select a Customer"
                            labelPlacement="outside"
                            classNames={{
                              base: "max-w-xs",
                              trigger: "h-12",
                            }}
                            renderValue={(items) =>
                              items.map((item) => (
                                <div
                                  key={item.key}
                                  className="flex py-[2px] px-[4px] items-center gap-2"
                                >
                                  <Avatar
                                    alt={item.data.customerImage}
                                    className="flex-shrink-0"
                                    size="sm"
                                    src={item.data.customerImage}
                                    isBordered
                                    color={item.data.imageColor}
                                  />
                                  <div className="flex flex-col">
                                    <span>{item.data.customerName}</span>
                                    <span className="text-default-500 text-tiny">
                                      {item.data.phone}
                                    </span>
                                  </div>
                                </div>
                              ))
                            }
                          >
                            {(user) => (
                              <SelectItem
                                key={user._id}
                                textValue={user.customerName}
                              >
                                <div
                                  onClick={() => {
                                    setSelectCustomer(user._id),
                                      setSelectCustomerName(user.customerName),
                                      setSelectCustomerPhone(user.phone),
                                      setSelectCustomerSince(user.createdAt());
                                  }}
                                  className="flex gap-2 py-[2px] px-[4px] items-center"
                                >
                                  <Avatar
                                    isBordered
                                    color={user.imageColor}
                                    alt={user.customerName}
                                    className="flex-shrink-0"
                                    size="sm"
                                    src={user.customerImage}
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-small">
                                      {user.customerName}
                                    </span>
                                    <span className="text-tiny text-default-400">
                                      {user.phone}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            )}
                          </Select>
                        </div>
                      )}
                      {!newCustomer && (
                        <div className="col-span-2">
                          <div className="col-span-2 sm:col-span-1">
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

                          <div className="col-span-2 my-[10px] sm:col-span-1">
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

                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="price"
                          className="block text-start text-primary mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          {...formik.getFieldProps("price")}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="$0"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="Payment Type"
                          className="block mb-2 text-start text-primary text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Payment Type
                        </label>
                        <select
                          {...formik.getFieldProps("paymentType")}
                          id="Payment Type"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option selected>Select Payment Type</option>
                          <option value="Cash">Cash</option>
                          <option value="Online">Online</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>

                      <div className="col-span-1 sm:col-span-1">
                        <label
                          htmlFor="Order Status"
                          className="block mb-2 text-start text-primary text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Order Status
                        </label>
                        <select
                          {...formik.getFieldProps("orderStatus")}
                          id="Order Status"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option selected>Select Order Status</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="progress">In-Progress</option>
                        </select>
                      </div>

                      <div className="col-span-1 sm:col-span-1">
                        <label
                          htmlFor="Order Status"
                          className="block mb-2 text-start text-primary text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Order Type
                        </label>
                        <select
                          {...formik.getFieldProps("orderType")}
                          id="Order Status"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option selected>Select Order Status</option>
                          <option value="takeAway">Take Away</option>
                          <option value="homeDelivery">Home Delivery</option>
                          <option value="dineIn">Dine In</option>
                        </select>
                      </div>

                      <div className="col-span-2 sm:col-span-2">
                        <label
                          htmlFor="orderNote"
                          className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Order Note
                        </label>
                        <input
                          type="text"
                          name="Add a Note"
                          id="Add a Note"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Add a Note"
                          {...formik.getFieldProps("orderNote")}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={toggleModal}
                        className="bg-white border-2 border-primary px-[10px] py-[5px] font-medium rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          formik.handleSubmit;
                        }}
                        className="bg-primary px-[10px] py-[5px] text-white rounded-md"
                      >
                        Add Order
                      </button>
                    </div>
                  </div>

                  {checkout && (
                    <div className="flex md:hidden flex-col w-[100%] md:w-[50%] justify-center item-center ">
                      <div className="flex justify-between items-center">
                        <h2>Order Details</h2>
                        <h2
                          onChange={(e) => handleCustomer(e)}
                          className="flex justify-center items-center"
                        >
                          Existing
                          <span className="hidden md:block">Customer</span>
                          <input
                            className="ml-[10px] px-[10px]"
                            type="checkbox"
                            checked={newCustomer}
                            onChange={(e) => handleCustomer}
                          />
                        </h2>
                      </div>
                      <div className="grid gap-4 my-[10px] mb-4 grid-cols-2">
                        {newCustomer && (
                          <div className="col-span-2">
                            <Select
                              items={customer}
                              label="Select a Customer"
                              placeholder="Select a Customer"
                              labelPlacement="outside"
                              classNames={{
                                base: "max-w-xs",
                                trigger: "h-12",
                              }}
                              renderValue={(items) =>
                                items.map((item) => (
                                  <div
                                    key={item.key}
                                    className="flex py-[2px] px-[4px] items-center gap-2"
                                  >
                                    <Avatar
                                      alt={item.data.customerImage}
                                      className="flex-shrink-0"
                                      size="sm"
                                      src={item.data.customerImage}
                                      isBordered
                                      color={item.data.imageColor}
                                    />
                                    <div className="flex flex-col">
                                      <span>{item.data.customerName}</span>
                                      <span className="text-default-500 text-tiny">
                                        {item.data.phone}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              }
                            >
                              {(user) => (
                                <SelectItem
                                  key={user._id}
                                  textValue={user.customerName}
                                >
                                  <div
                                    onClick={() => {
                                      setSelectCustomer(user._id),
                                        setSelectCustomerName(
                                          user.customerName
                                        ),
                                        setSelectCustomerPhone(user.phone);
                                    }}
                                    className="flex gap-2 py-[2px] px-[4px] items-center"
                                  >
                                    <Avatar
                                      isBordered
                                      color={user.imageColor}
                                      alt={user.customerName}
                                      className="flex-shrink-0"
                                      size="sm"
                                      src={user.customerImage}
                                    />
                                    <div className="flex flex-col">
                                      <span className="text-small">
                                        {user.customerName}
                                      </span>
                                      <span className="text-tiny text-default-400">
                                        {user.phone}
                                      </span>
                                    </div>
                                  </div>
                                </SelectItem>
                              )}
                            </Select>
                          </div>
                        )}
                        {!newCustomer && (
                          <div className="col-span-2">
                            <div className="col-span-2 sm:col-span-1">
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

                            <div className="col-span-2 my-[10px] sm:col-span-1">
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

                        <div className="col-span-2 sm:col-span-1">
                          <label
                            htmlFor="price"
                            className="block text-start text-primary mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Price
                          </label>
                          <input
                            type="number"
                            name="price"
                            id="price"
                            {...formik.getFieldProps("price")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="$0"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label
                            htmlFor="Payment Type"
                            className="block mb-2 text-start text-primary text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Payment Type
                          </label>
                          <select
                            {...formik.getFieldProps("paymentType")}
                            id="Payment Type"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          >
                            <option selected>Select Payment Type</option>
                            <option value="Cash">Cash</option>
                            <option value="Online">Online</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </div>

                        <div className="col-span-1 sm:col-span-1">
                          <label
                            htmlFor="Order Status"
                            className="block mb-2 text-start text-primary text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Order Status
                          </label>
                          <select
                            {...formik.getFieldProps("orderStatus")}
                            id="Order Status"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          >
                            <option selected>Select Order Status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="progress">In-Progress</option>
                          </select>
                        </div>

                        <div className="col-span-1 sm:col-span-1">
                          <label
                            htmlFor="Order Status"
                            className="block mb-2 text-start text-primary text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Order Type
                          </label>
                          <select
                            {...formik.getFieldProps("orderType")}
                            id="Order Status"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          >
                            <option selected>Select Order Status</option>
                            <option value="takeAway">Take Away</option>
                            <option value="homeDelivery">Home Delivery</option>
                            <option value="dineIn">Dine In</option>
                          </select>
                        </div>

                        <div className="col-span-2 sm:col-span-2">
                          <label
                            htmlFor="orderNote"
                            className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Order Note
                          </label>
                          <input
                            type="text"
                            name="Add a Note"
                            id="Add a Note"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Add a Note"
                            {...formik.getFieldProps("orderNote")}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          onClick={toggleModal}
                          className="bg-white border-2 border-primary px-[10px] py-[5px] font-medium rounded-md"
                        >
                          Cancel
                        </button>
                        <button className="bg-primary px-[10px] py-[5px] text-white rounded-md">
                          Add Order
                        </button>
                      </div>
                    </div>
                  )}

                  {!checkout && (
                    <div className="md:ml-[40px] w-[100%] md:w-[50%]">
                      <div>
                        <div className="chalaja custom-image sidebar-image overflow-y-scroll max-h-[500px]">
                          <h1 className="text-primary text-start">
                            Product Search
                          </h1>
                          <div className="bg-white w-[100%] md:w-[50%] h-[80px] md:h-[60px] right-0 absolute bottom-0 fixed">
                            <div className="bg-primary absolute fixed bottom-8 md:bottom-3 left-4 text-white rounded-md py-[3px] text-[18px] px-[15px]">
                              Total : $
                              {products
                                .reduce((total, product) => {
                                  const quantity = quantities[product._id] || 0;
                                  return total + product.price * quantity;
                                }, 0)
                                .toFixed(2)}
                            </div>
                          </div>

                          {cart === true && (
                            <button
                              onClick={(e) => viewCheckout(e)}
                              className="bg-primary md:hidden absolute fixed bottom-8 md:bottom-3 right-4 text-white rounded-md py-[3px] text-[18px] px-[15px]"
                            >
                              Proceed
                            </button>
                          )}

                          <button
                            onClick={(e) => viewCart(e)}
                            className="bg-primary absolute fixed bottom-8 md:bottom-3 right-4 text-white rounded-md py-[3px] text-[18px] px-[15px]"
                          >
                            {cart === false && (
                              <div className="">View Cart</div>
                            )}
                            {cart === true && (
                              <div className="hidden md:block">
                                View Products
                              </div>
                            )}
                          </button>

                          <div className="flex bg-gray-50 pr-[20px] border outline-none text-sm rounded-lg dark:border-gray-500 dark:placeholder-gray-400 dark:text-white justify-center items-center">
                            <input
                              type="text"
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder="Search for products..."
                              className="p-2.5 outline-none w-full"
                            />
                            <CiSearch
                              onClick={searchProducts}
                              className="text-[24px]"
                            />
                          </div>
                          {loading && <p>Loading...</p>}
                          {error && <p>{error}</p>}
                          <div>
                            {products.length > 0 &&
                              products.map((product) => {
                                if (quantities[product._id] > 0) {
                                  AddedProduct.push({ product, quantities });
                                  console.log("Product", AddedProduct);
                                  return <div key={product._id}></div>;
                                }
                                return null;
                              })}
                          </div>

                          {cart === false && (
                            <div className="pb-[60px] chalaja custom-image custom-sidebar">
                              {products.length > 0 ? (
                                products.map((product) => (
                                  <div key={product._id}>
                                    <div className="flex border-2 justify-between rounded-xl items-center py-[10px] px-[10px] my-[12px]">
                                      <div className="flex justify-between">
                                        <img
                                          className="w-[70px] h-[70px] rounded-md"
                                          src={product.photos[0]}
                                          alt={product.productName}
                                        />
                                        <div className="flex text-start mx-[14px] flex-col">
                                          <h2 className="font-poppins font-medium">
                                            {product.productName}
                                          </h2>
                                          <p>$ {product.price}</p>
                                        </div>
                                      </div>

                                      {quantities[product._id] > 0 ? (
                                        <div className="flex">
                                          <button
                                            onClick={(event) =>
                                              addItem(event, product._id)
                                            }
                                            className="border-2 bg-slate-200 px-[8px] border-indigo-500/40 text-[17px] font-medium rounded-md"
                                          >
                                            +
                                          </button>
                                          <div className="mx-[8px]">
                                            {quantities[product._id]}
                                          </div>
                                          <button
                                            onClick={(event) =>
                                              deleteItem(event, product._id)
                                            }
                                            className="border-2 bg-slate-200 px-[7px] border-indigo-500/40 text-[17px] font-medium rounded-md"
                                          >
                                            -
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={(event) =>
                                            addItem(event, product._id)
                                          }
                                          className="text-primary cursor-pointer justify-center items-center"
                                        >
                                          <div>Add Item</div>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No products found.</p>
                              )}
                            </div>
                          )}
                          {cart === true && (
                            <div className="pb-[65px]">
                              {cartProduct.length > 0 ? (
                                cartProduct.map((item) => (
                                  <div key={item.product._id}>
                                    <div className="flex border-2 justify-between rounded-xl items-center py-[10px] px-[10px] my-[12px]">
                                      <div className="flex justify-between">
                                        <img
                                          className="w-[70px] h-[70px] rounded-md"
                                          src={item.product.photos[0]}
                                          alt={item.product.productName}
                                        />
                                        <div className="flex text-start mx-[14px] flex-col">
                                          <h2 className="font-poppins font-medium">
                                            {item.product.productName}
                                          </h2>
                                          <p>$ {item.product.price}</p>
                                        </div>
                                      </div>

                                      {quantities[item.product._id] > 0 ? (
                                        <div className="flex">
                                          <button
                                            onClick={(event) =>
                                              addItem(event, item.product._id)
                                            }
                                            className="border-2 bg-slate-200 px-[8px] border-indigo-500/40 text-[17px] font-medium rounded-md"
                                          >
                                            +
                                          </button>
                                          <div className="mx-[8px]">
                                            {quantities[item.product._id]}
                                          </div>
                                          <button
                                            onClick={(event) =>
                                              deleteItem(
                                                event,
                                                item.product._id
                                              )
                                            }
                                            className="border-2 bg-slate-200 px-[7px] border-indigo-500/40 text-[17px] font-medium rounded-md"
                                          >
                                            -
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={(event) =>
                                            addItem(event, item.product._id)
                                          }
                                          className="text-primary cursor-pointer justify-center items-center"
                                        >
                                          <div>Add Item</div>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No products found.</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewOrder;
