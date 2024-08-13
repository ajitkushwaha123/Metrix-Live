import React, { useState, useEffect } from "react";
import { loader } from "../assets";
import { CiSearch } from "react-icons/ci";
import { FaSearchengin } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import {
  getCategory,
  getAllCustomers,
  getProductByCategoryId,
  addCustomers,
  insertOrders,
  getProd,
  invoiceGenerator,
} from "../helper/helper";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Button, Select, SelectItem, Avatar } from "@nextui-org/react";
import { productImg } from "../assets";
import { useParams, useNavigate } from "react-router-dom";
import Invoice from "./Invoice";
import useFetch from "../hooks/fetch.hooks";
import { set } from "date-fns";
// import NewOrder from "../Pages/NewOrder";

const Menu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [changeBtn, setChangeBtn] = useState(false);
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [cartProduct, setCartProduct] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [checkout, setCheckout] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState("");
  const [selectCustomerName, setSelectCustomerName] = useState("");
  const [selectCustomerPhone, setSelectCustomerPhone] = useState("");
  const [cart, setCart] = useState(false);
  const [newCustomer, setNewCustomer] = useState(false);
  const navigate = useNavigate();
  const [orderId , setOrderId] = useState("");

  const [{apiData, serverError}] = useFetch();

  const items = [];
  const invoice = {
    restourantLogo : apiData?.profile,
    restourantName : apiData?.name, 
    restourantAddress : apiData?.address,
    restourantPhone : apiData?.phone,
    customerName : "",
    customerPhone : "",
    billStatus : "",
    paymentType : "",
    orderType : "",
    orderNumber : "",
    orderDate : "",
    orderTime : "",
    items : [],
    tax : "",
  }

  const { id } = useParams();
  console.log("ID", id);

  const AddedProduct = [];

  const generateInvoice = async (invoice) => {
    try{
      const respone = await invoiceGenerator(invoice);
      console.log("Invoice Generated:", respone);
    }catch(err){
      console.log("Error while generating invoice:", err);
    }
  }

  const fetchAllProducts = async () => {
    try {
      const response = await getProd();
      console.log("Products:", response.data);
      setProduct(response.data);
    } catch (err) {
      console.error("Error while fetching products:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers();
      setCustomer(response);
      console.log("Customer data fetched successfully", response);
    } catch (error) {
      console.log("Error while fetching customer data", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchCustomers();
  }, []);

  const fetchCategory = async () => {
    try {
      const res = await getCategory();
      setCategory(res.data.categories);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const fetchProduct = async (id) => {
    setIsLoading(true);
    const { data } = await getProductByCategoryId(id);
    setProduct(data);
    console.log("response:", product);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleProductClick = (e, item) => {
    e.preventDefault();

    const existingCartItem = cartProduct.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingCartItem) {
      setCartProduct((prevCartProduct) =>
        prevCartProduct.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartProduct((prevCartProduct) => [
        ...prevCartProduct,
        { ...item, quantity: 1 },
      ]);
    }

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item._id]: (prevQuantities[item._id] || 0) + 1,
    }));
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
    const updateTotalCartValue = () => {
      let totalQuantity = 0;
      const total = cartProduct
        .reduce((total, product) => {
          const quantity = quantities[product._id] || 0;
          totalQuantity += quantity;
          return total + product.price * quantity;
        }, 0)
        .toFixed(2);

      console.log("Total:", total);
      setTotal(total);
      console.log("Total Quantity:", totalQuantity);
      formik.setFieldValue("price", total);
    };

    updateTotalCartValue();
  }, [cartProduct, quantities]);

  const handleOrder = async (values) => {
    setChangeBtn(true);
    console.log("Order Added", values.products);

    const response = await insertOrders(values);


    console.log("Order Added", response);

    invoice.customerName = values.customerName;
    invoice.customerPhone = values.phone;
    invoice.billStatus = values.orderStatus;
    invoice.paymentType = values.paymentType;
    invoice.orderType = values.orderType;
    invoice.items = items;
    invoice.tax = 0;
    invoice.orderDate = new Date().toLocaleDateString();
    invoice.orderTime = new Date().toLocaleTimeString();
    invoice.orderNumber = orderId;
    

    // invoice.orderNumber = response.data._Id;

    console.log("Invoice:", invoice);

    generateInvoice(invoice);
    setChangeBtn(false);
    return response;

  };

  const formik = useFormik({
    initialValues: {
      customerName: "",
      phone: "8178739633",
      price: 0,
      paymentType: "Cash",
      orderStatus: "pending",
      orderNote: "",
      products: [], 
      quantity: 0,
      customerImage:
        "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
      imageColor: "tertiary",
      customerId: "",
      orderType: "dineIn",
      tableId: id.toString(),
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {

      setChangeBtn(true);
      console.log("Added Producttttttttt:", AddedProduct);

      if (values.products == 0) {
        values.products = AddedProduct;
      }

      values.tableId = id;
      console.log(values.tableId);

      console.log("Form Values:", values);
      if (selectCustomer !== "") {
        values.customerId = selectCustomer;
        values.customerName = selectCustomerName;
        values.phone = selectCustomerPhone;
      } else {
        console.log("New Customer");
        let customerPromise = await addCustomers(values);

        console.log("Customer ID", customerPromise.customer._id);
        values.customerId = customerPromise.customer._id;
      }

      try {
        console.log("Values:", values);
        let orderPromise = handleOrder(values);
        toast.promise(orderPromise, {
          loading: "Creating...",
          success: <b>Order Created Successfully... !</b>,
          error: <b>Couldn't Create Order... !</b>,
        });

        formik.resetForm();
        setCartProduct([]);
        setQuantities({});
        setTotal(0);


        navigate("/table-booking");
      } catch (err) {
        console.log("Error while adding order:", err);
      }
    },
  });

  const handleCustomer = () => {
    setNewCustomer((prevState) => !prevState);
    console.log(!newCustomer);
  };

  return (
    <div className="flex w-full bg-[#EEF0FA] px-[15px] md:px-[0px] md:ml-[15px] flex-col md:flex-row my-[20px] text-[16px]">
      <Toaster position="top-center" reverseOrder="false"></Toaster>
      <div className="flex w-[100%] h-screen chalaja md:w-[80%]">
        <div className="w-[50%] md:w-[25%] h-[100%] chalaja overflow-y-scroll">
          <div className="h-[50px] cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center">
            Categories
          </div>

          {category.map((item, index) => {
            return (
              <div
                onClick={() => fetchProduct(item._id)}
                key={index}
                className="h-[50px] overflow-x-scroll chalaja cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white"
              >
                {item.name}
              </div>
            );
          })}
        </div>
        <div className="w-[50%] h-[100%] md:w-[75%]">
          <div className="flex justify-center items-center">
            <div className="w-[50%] h-[50px] flex rounded-md bg-white items-center ml-[10px]">
              <CiSearch className="text-[20px] mx-[10px]" />
              <input type="text" className="w-[90%] outline-none py-2" />
            </div>
            <div className="w-[50%] py-3 h-[50px] flex justify-center rounded-md bg-white items-center ml-[10px]">
              <FaSearchengin className="text-[15px] mx-[10px]" />
              <input type="text" className="w-[100%] outline-none py-2" />
            </div>
          </div>

          {!isLoading && (
            <div className="ml-3 my-3 h-[90%] overflow-y-scroll chalaja rounded-md">
              <div className="grid cursor-pointer grid-cols-1 md:grid-cols-4 gap-4">
                {product.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={(e) => {
                        handleProductClick(e, item);
                      }}
                      className="h-[80px] overflow-x-scroll chalaja flex justify-center items-center bg-white p-4 rounded-md text-start"
                    >
                      {item.productName}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="m-3 h-[80%] flex rounded-md">
              <img src="https://i.pinimg.com/originals/ae/51/e1/ae51e1395e87cc72c6021df5445cc5f8.gif" />
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:mx-[15px] bg-white my-[20px] md:my-[0px] mb-[40px] md:mb-[0px] md:w-[40%] md:block md:relative">
        <div className="w-[100%] px-[10px] mt-[20px] py-3 h-[50px] flex justify-center items-center">
          <button className="bg-primary w-[33%] mx-[5px] text-white px-[15px] py-3 rounded-md">
            Dine In
          </button>
          <button className="bg-primary w-[33%] mx-[5px] text-white px-[15px] py-3 rounded-md">
            Delivery
          </button>
          <button className="bg-primary w-[33%] mx-[5px] text-white px-[15px] py-3 rounded-md">
            Pickup
          </button>
        </div>

        {!checkout && (
          <div className="text-start p-4 m-3 rounded-md">
            <div className="flex justify-between items-center">
              <div className="w-[50%]">
                <p>Product Name</p>
              </div>

              <div className="w-[30%]">Qunatity</div>
              <div className="w-[20%]">Amount</div>
            </div>

            <div className="overflow-y-scroll chalaja h-[430px]">
              {cartProduct.length == 0 && (
                <div className="flex py-[40px] justify-center items-center flex-col">
                  <img width={"200px"} src={productImg} />
                  <p className="font-medium my-[20px] font-poppins text-[22px]">
                    No Products Yet
                  </p>
                  <p className="text-center px-[40px]">
                    Add products to Cart to see products here.
                  </p>
                </div>
              )}
              {cartProduct.length > 0 &&
                cartProduct.map((item, index) => {
                  console.log("cartProduct:", cartProduct);
                  return (
                    <div
                      key={index}
                      className="flex py-3 cursor-pointer overflow-y-scroll chalaja border-2 border-slate-100 rounded-md my-[10px] px-[10px] justify-between items-center"
                    >
                      <div className=" w-[50%]">
                        <p>{item.productName}</p>
                      </div>

                      <div>
                        <div className="flex  w-[30%] justify-center items-center">
                          {quantities[item._id] > 0 ? (
                            <div className="flex">
                              <button
                                onClick={(event) => addItem(event, item._id)}
                                className="border-2 bg-slate-200 px-[8px] border-indigo-500/40 text-[17px] font-medium rounded-md"
                              >
                                +
                              </button>
                              <div className="mx-[8px]">
                                {quantities[item._id]}
                              </div>
                              <button
                                onClick={(event) => deleteItem(event, item._id)}
                                className="border-2 bg-slate-200 px-[7px] border-indigo-500/40 text-[17px] font-medium rounded-md"
                              >
                                -
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(event) => addItem(event, item._id)}
                              className="text-primary cursor-pointer justify-center items-center"
                            >
                              <div>Add Item</div>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className=" w-[20%]">
                        {item.price * quantities[item._id]}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="w-[100%] md:absolute md:fixed left-0 right-0 md:bottom-4 pt-3 h-[50px] flex justify-center items-center">
              <button className="bg-primary w-[33%] md:w-[28%] mx-[10px] text-white px-[15px] py-3 rounded-md">
                {total}
              </button>

                <button
                  className="w-[33%] md:w-[28%] text-white px-[15px] rounded-md py-3 inline-flex items-center gap-x-2 text-md flex justify-center items-center font-medium rounded-lg border border-transparent bg-primary text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Invoice />
                </button>

              {cartProduct.length > 0 && (
                <button
                  onClick={() => {
                    setCheckout(true);
                  }}
                  className="bg-success w-[33%] md:w-[28%] mx-[10px] text-white px-[15px] py-3 rounded-md"
                >
                  Proceed
                </button>
              )}
              {cartProduct.length == 0 && (
                <button className="bg-green-300 w-[33%] md:w-[28%] ml-[10px] text-white px-[15px] py-3 rounded-md">
                  Proceed
                </button>
              )}
            </div>
          </div>
        )}

        <div>
          {cartProduct.length > 0 &&
            cartProduct.map((product) => {
              if (quantities[product._id] > 0) {
                AddedProduct.push({ product, quantities });
                items.push(product);
                console.log("Product", AddedProduct);
                return <div key={product._id}></div>;
              }
              return null;
            })}
        </div>

        {checkout && (
          <form
            onSubmit={formik.handleSubmit}
            className="p-4 bg-white m-[10px] flex flex-col md:flex-row md:p-5"
          >
            <div className="flex hidden md:block flex-col w-[100%] justify-center item-center ">
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
                  onClick={() => {
                    setCheckout(false);
                  }}
                  className="bg-white border-2 border-primary px-[10px] py-[5px] font-medium rounded-md"
                >
                  Back
                </button>
                {!changeBtn && (
                  <button
                    onClick={() => {
                      formik.handleSubmit;
                    }}
                    className="bg-primary px-[10px] py-[5px] text-white rounded-md"
                  >
                    Add Order
                  </button>
                )}
                {changeBtn && (
                  <Button color="primary" isLoading>
                    Loading
                  </Button>
                )}
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
                                  setSelectCustomerName(user.customerName),
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

                  <div className="flex w-[100%] col-span-2 justify-between items-center">
                    <button
                      onClick={() => {
                        setCheckout(false);
                      }}
                      className="bg-white border-2 border-primary px-[10px] py-[5px] font-medium rounded-md"
                    >
                      Back
                    </button>
                    {!changeBtn && (
                      <button
                        onClick={() => {
                          formik.handleSubmit;
                        }}
                        className="bg-primary px-[10px] py-[5px] text-white rounded-md"
                      >
                        Add Order
                      </button>
                    )}
                    {changeBtn && (
                      <Button color="primary" isLoading>
                        Loading
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Menu;
