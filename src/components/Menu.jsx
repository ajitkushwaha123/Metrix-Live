import React, { useState, useEffect } from "react";
import { loader, noCategory, noProduct } from "../assets";
import { CiSearch } from "react-icons/ci";
import { FaSearchengin } from "react-icons/fa";
import {
  getCategory,
  getAllCustomers,
  getProductByCategoryId,
  addCustomers,
  insertOrders,
  getProd,
  invoiceGenerator,
  getDiscount,
  getTax,
  invoiceEdit,
  searchProduct,
  searchProductByShortCode,
} from "../helper/helper";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Button, Select, SelectItem, Avatar, select } from "@nextui-org/react";
import { productImg } from "../assets";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import useFetch from "../hooks/fetch.hooks";
import { FaDownload } from "react-icons/fa6";
import PriceFormatter from "../helper/priceFormatter";
import LoadingButton from "./LoadingButton";
import Variant from "./Variant";

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
  const [selectCustomerSince, setSelectCustomerSince] = useState(new Date());
  const [cart, setCart] = useState(false);
  const [newCustomer, setNewCustomer] = useState(false);
  const navigate = useNavigate();
  const [invoiceId, setInvoiceId] = useState("");
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [fetchDiscount, setFetchDiscount] = useState([]);
  const [fetchTax, setFetchTax] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");
  const [tax, setTax] = useState(0);
  const [kotGenerated, setKotGenerated] = useState(false);
  const [addingOrder, setAddingOrder] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [shortCodeQuery, setShortCodeQuery] = useState("");
  const [{ apiData, serverError }] = useFetch();
  const [finalValue , setFinalValue] = useState(0);

  const items = [];
  const invoice = {
    restourantLogo: apiData?.profile,
    restourantName: apiData?.name,
    restourantAddress: apiData?.address,
    restourantPhone: apiData?.phone,
    customerName: "",
    customerPhone: "",
    billStatus: "",
    paymentType: "",
    orderType: "",
    orderNumber: "",
    orderDate: "",
    orderTime: "",
    items: [],
    tax: 0,
  };

  const { id } = useParams();
  console.log("ID", id);
  const [active, setActive] = useState("");

  const AddedProduct = [];

  const generateInvoice = async (invoice) => {
    setIsGeneratingInvoice(true);
    try {
      const res = await invoiceGenerator(invoice);
      console.log("Response from invoiceGenerator:", res);
      if (res && res._id) {
        setInvoiceId(res._id.toString());
        console.log("Invoice ID set:", res._id);
        formik.setFieldValue("invoiceId", res._id.toString());
        return res._id.toString(); // Return the invoice ID
      } else {
        console.error("No _id found in response");
        return null;
      }
    } catch (err) {
      toast.error(`Error Generating Invoice: ${err}`);
      return null;
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const editInvoice = async (invoice) => {
    console.log("invoiceId", invoiceId);
    try {
      const res = await invoiceEdit(invoiceId, invoice);
      console.log("res", res);
    } catch (err) {
      toast.error(`Error editing invoice: ${err}`);
      console.log("Error editing Invoice");
    }
  };

  const handleOrder = async (values) => {
    setChangeBtn(true);
    console.log("Order Added", values);

    const response = await insertOrders(values);

    console.log("Order Added", response);
    console.log("Invoice:", invoiceId);

    setChangeBtn(false);
    return response;
  };

  const formik = useFormik({
    initialValues: {
      customerName: "",
      phone: "",
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
      invoiceId: "",
      customerSince: "",
      newCustomer: true,
      discount: 0,
      tax: 0,
      discountType: "percentage",
      totalAmount : "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setAddingOrder(true);
      values.tableId = id;
      console.log("Form Values:", values); 
      values.customerSince = selectCustomerSince;

      if (selectCustomer !== "") {
        values.customerId = selectCustomer;
        values.customerName = selectCustomerName;
        values.phone = selectCustomerPhone;
        values.newCustomer = false;
        invoice.customerName = selectCustomerName;
        console.log("selectedCustomer", selectCustomerSince);
      } else {
        console.log("New Customer");
        let customerPromise = await addCustomers(values);
        console.log("Customer ID", customerPromise.customer._id);
        values.customerId = customerPromise.customer._id;
      }

      values.discount = discount;
      values.tax = tax;
      values.discountType = discountType;
      invoice.customerName = values.customerName;
      invoice.customerPhone = values.phone;
      invoice.billStatus = values.orderStatus;
      invoice.paymentType = values.paymentType;
      invoice.orderType = values.orderType;
      invoice.items = items;
      invoice.tax = (tax * values.totalAmount) / 100 || 0;
      invoice.discount =
        discountType === "percentage"
          ? (discount * values.totalAmount) / 100
          : discount;
      invoice.orderDate = new Date().toLocaleDateString();
      invoice.orderTime = new Date().toLocaleTimeString();

      let currentInvoiceId = invoiceId;
      if (!currentInvoiceId) {
        currentInvoiceId = await generateInvoice(invoice);
        console.log("Invoice ID is not set yet.");
      } else {
        await editInvoice(invoice);
      }

      if (currentInvoiceId) {
        values.invoiceId = currentInvoiceId;
        console.log("Added Product:", AddedProduct);

        if (values.products.length === 0) {
          values.products = AddedProduct;
        }

        console.log("values", values);

        try {
          let orderPromise = handleOrder(values);
          toast.promise(orderPromise, {
            loading: "Creating...",
            success: <b>Order Created Successfully... !</b>,
            error: <b>Couldn't Create Order... !</b>,
          });

          console.log("Id", currentInvoiceId);

          formik.resetForm();
          setAddingOrder(false);
          if(values.tableId !== "-1")
          {
            navigate("/table-booking");
          }else{
            navigate("/order");
          }
        } catch (err) {
          console.error("Error handling order:", err);
          setAddingOrder(false);
        }
      } else {
        console.error("Failed to generate or retrieve invoice ID");
        setAddingOrder(false);
      }
    },
  });

  const generateKOT = async () => {
    try {
      invoice.items = items;
      invoice.tax = (tax * finalValue) / 100 || 0;
      if (discountType == "percentage") {
        invoice.discount = (discount * finalValue) / 100;
      } else {
        invoice.discount = discount;
      }
      invoice.orderDate = new Date().toLocaleDateString();
      invoice.orderTime = new Date().toLocaleTimeString();
      const response = await generateInvoice(invoice);
      setKotGenerated(true);
      toast.success("KOT Generated... !");
      console.log(response);
    } catch (err) {
      toast.error(`Error Generating KOT... ! ${err}`);
    }
  };

  useEffect(() => {
    const updateTotalCartValue = () => {
      let totalQuantity = 0;
      const total = cartProduct
        .reduce((total, product) => {
          const itemKey = `${product._id}-${product.price}`;
          const quantity = quantities[itemKey] || 0;
          totalQuantity += quantity;
          return total + product.price * quantity;
        }, 0)
        .toFixed(2);

      console.log("Total:", total);
      setTotal(total);
      console.log("Total Quantity:", totalQuantity);
      formik.setFieldValue("totalAmount" , total);
    };

    updateTotalCartValue();
  }, [cartProduct, quantities]);

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

  const handleCustomer = () => {
    setNewCustomer((prevState) => !prevState);
    console.log(!newCustomer);
  };

  const fetchedDiscount = async () => {
    try {
      const res = await getDiscount();
      setFetchDiscount(res.data.discounts);
    } catch (error) {
      console.error("Error fetching discount:", error);
    }
  };

  useEffect(() => {
    fetchedDiscount();
  }, []);

  const fetchedTax = async () => {
    try {
      const res = await getTax();
      setFetchTax(res.data.taxes);
    } catch (error) {
      console.error("Error fetching tax:", error);
    }
  };

  useEffect(() => {
    fetchedTax();
  }, []);

  const handleDownload = (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_URL}/api/invoice/kot/${invoiceId}`;
    alert(url);
    window.open(url, "_blank");
  };

  const handleShowVariant = (e, variants) => {
    e.preventDefault();
    console.log("varr", variants);

    setSelectedVariants(variants);
  };

  const handleProductClick = (e, item) => {
    if (e) e.preventDefault();
    toast.success(`${item.productName} added to cart`);

    const itemKey = `${item._id}-${item.price}`;
    console.log("Item Key:", itemKey);

    const existingCartItem = cartProduct.find(
      (cartItem) => cartItem._id === item._id && cartItem.price === item.price
    );

    if (existingCartItem) {
      setCartProduct((prevCartProduct) =>
        prevCartProduct.map((cartItem) =>
          cartItem._id === item._id && cartItem.price === item.price
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
      console.log("Existing item found, quantity increased.");
    } else {
      setCartProduct((prevCartProduct) => [
        ...prevCartProduct,
        { ...item, quantity: 1 },
      ]);
      console.log("New item added to cart with quantity 1.");
    }

    setQuantities((prevQuantities) => {
      const newQuantities = {
        ...prevQuantities,
        [itemKey]: (prevQuantities[itemKey] || 0) + 1,
      };
      console.log("Updated Quantities:", newQuantities);
      return newQuantities;
    });
  };

  const handleVariantSelect = (variant, variantName, product) => {
    const updatedProduct = {
      ...product,
      productName: product.productName + " - " + variantName,
      price: variant,
    };
    handleProductClick(null, updatedProduct);
  };

  const addItem = (event, itemKey) => {
    event.preventDefault();
    setQuantities((prevQuantities) => {
      const newQuantities = {
        ...prevQuantities,
        [itemKey]: (prevQuantities[itemKey] || 0) + 1,
      };
      console.log("Add Item - Updated Quantities:", newQuantities);
      return newQuantities;
    });

    setCartProduct((prevCartProduct) =>
      prevCartProduct.map((cartItem) =>
        `${cartItem._id}-${cartItem.price}` === itemKey
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  const searchByName = async (e) => {
    setIsLoading(true);
    console.log(searchQuery);
    try {
      const { data } = await searchProduct(searchQuery);
      console.log("data", data);
      setProduct(data);
      setIsLoading(false);
    } catch (err) {
      toast.error(`Error Finding Product ${err}`);
      setIsLoading(false);
    }
  };

  const searchByShortCode = async (e) => {
    setIsLoading(true);
    console.log(searchQuery);
    try {
      const { data } = await searchProductByShortCode(shortCodeQuery);
      console.log(data);
      setProduct(data);
      setIsLoading(false);
    } catch (err) {
      toast.error(`Error Finding Product ${err}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const calculateTotalValue = () => {
      const finalTotal =
        discountType === "percentage"
          ? total - (discount * total) / 100 + (tax * total) / 100
          : total - discount + (total * tax) / 100;

      setFinalValue(finalTotal);
      console.log("final", finalTotal);

      formik.setFieldValue("price", finalTotal);
    };

    calculateTotalValue();
  }, [total, discount, tax, discountType]);

  return (
    <div className="flex w-full bg-[#EEF0FA] px-[15px] md:px-[0px] md:ml-[15px] flex-col md:flex-row my-[20px] text-[16px]">
      <Toaster position="top-center" reverseOrder="false"></Toaster>
      <div className="flex w-[100%] h-[90vh] chalaja md:w-[80%]">
        <div className="w-[50%] bg-white md:w-[30%] h-[100%] chalaja overflow-y-scroll">
          <div className="h-[50px] cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center">
            Categories
          </div>
          {category?.length > 0 ? (
            category?.map((item) => {
              console.log("asdf", active);
              return (
                <div
                  onClick={() => {
                    fetchProduct(item._id);
                    setActive(item._id);
                  }}
                  key={item._id}
                  className={`h-[50px] ${
                    active === item._id.toString()
                      ? "bg-primary text-white rounded-md"
                      : "bg-white text-black"
                  } overflow-x-scroll chalaja cursor-pointer border-b-2 border-slate-200 flex justify-center items-center`}
                >
                  {item.name}
                </div>
              );
            })
          ) : (
            <div className="py-[20px]">
              <img src={noCategory} />
              <p className="text-[20px] my-[15px] font-medium font-poppins">
                No Category found ! Add more
              </p>
              <NavLink to="/upload-menu">
                <button className="px-[15px] py-2 bg-primary text-white rounded-xl my-[15px]">
                  Add Category
                </button>
              </NavLink>
            </div>
          )}
        </div>
        <div className="w-[50%] mx-3 my-[-10px] h-[100%] md:w-[70%]">
          <div className="flex justify-center items-center">
            <div className="w-[50%] hidden  px-[10px] h-[50px] md:flex rounded-md bg-white items-center ml-[10px]">
              <input
                placeholder="Search Product Name"
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                className="w-[90%] outline-none py-2"
              />
              <button
                onClick={(e) => {
                  searchByName(e);
                }}
                className="bg-primary py-2 rounded-xl text-white"
              >
                <CiSearch className="text-[20px] mx-[10px]" />
              </button>
            </div>
            <div className="w-[50%] px-[10px] h-[50px] hidden md:flex rounded-md bg-white items-center ml-[10px]">
              <input
                placeholder="Search By short Code"
                onChange={(e) => setShortCodeQuery(e.target.value)}
                type="text"
                className="w-[90%] outline-none py-2"
              />
              <button
                onClick={(e) => {
                  searchByShortCode(e);
                }}
                className="bg-primary py-2 rounded-xl text-white"
              >
                <FaSearchengin className="text-[20px] mx-[10px]" />
              </button>
            </div>
          </div>

          {!isLoading && (
            <div className="mx-3 my-3 h-[100%] md:h-[92%] w-[100%] overflow-y-scroll chalaja rounded-md">
              {product?.length > 0 ? (
                <div className="grid cursor-pointer grid-cols-1 md:grid-cols-4 gap-4">
                  {product?.map((item, index) =>
                    item?.variant?.length > 0 ? (
                      <div
                        key={index}
                        onClick={(e) => handleShowVariant(e, item?.variant)}
                        className="h-[80px] overflow-x-scroll chalaja flex justify-center items-center bg-white p-4 rounded-md text-start"
                      >
                        <p>
                          <Variant
                            variant={item?.variant}
                            productName={item?.productName}
                            onVariantSelect={(variant) => {
                              const variantName = item.variant.find(
                                (v) => v.value === variant
                              )?.variant;
                              handleVariantSelect(variant, variantName, item);
                            }}
                          />
                        </p>
                      </div>
                    ) : (
                      <div
                        key={index}
                        onClick={(e) => handleProductClick(e, item)}
                        className="h-[80px] overflow-x-scroll chalaja flex justify-center items-center bg-white p-4 rounded-md text-start"
                      >
                        <p>{item.productName}</p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="w-full px-[12px] bg-white h-[100%] mx-auto flex flex-col justify-center items-center">
                  <img
                    className="md:w-[280px] w-[150px] h-[150px] md:h-[280px]"
                    src={noProduct}
                    alt="No products available"
                  />
                  <p className="text-[20px] font-medium font-poppins">
                    No Products Added!
                  </p>
                  <NavLink to="/upload-menu">
                    <button className="px-[15px] py-2 bg-primary text-white rounded-xl my-[15px]">
                      Add Product
                    </button>
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="m-3 h-[80%] flex rounded-md">
              <img src="https://i.pinimg.com/originals/ae/51/e1/ae51e1395e87cc72c6021df5445cc5f8.gif" />
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:mx-[15px] h-[90vh] mt-[20px] md:my-[0px] mb-[40px] md:mb-[0px] bg-white md:w-[40%] md:block">
        {!checkout && (
          <div className="text-start w-full flex flex-col justify-between items-center h-[100%]  p-4 md:mt-[0px] rounded-md">
            <div className="flex w-[100%] justify-between text-start items-center">
              <div className="w-[50%]">
                <p>Product Name</p>
              </div>

              <div className="w-[30%]">Quantity</div>
              <div className="w-[20%]">Amount</div>
            </div>

            <div className="overflow-y-scroll w-[100%] mt-[10px] chalaja bg-white h-[500px]">
              {cartProduct?.length == 0 && (
                <div className="flex py-[40px] justify-center items-center flex-col">
                  <img width={"180px"} src={productImg} />
                  <p className="font-medium my-[20px] font-poppins text-[22px]">
                    No Products Yet
                  </p>
                  <p className="text-center px-[40px]">
                    Add products to Cart to see products here.
                  </p>
                </div>
              )}
              {cartProduct?.length > 0 &&
                cartProduct?.map((item, index) => {
                  const itemKey = `${item._id}-${item.price}`;
                  console.log("cartProduct:", cartProduct);
                  return (
                    <div
                      key={index}
                      className="flex py-3 w-[100%] cursor-pointer overflow-y-scroll chalaja border-2 border-slate-100 rounded-md my-[10px] px-[10px] justify-between items-center"
                    >
                      <div className="w-[50%]">
                        <p>{item.productName}</p>
                      </div>

                      <div>
                        <div className="flex w-[30%] justify-center items-center">
                          {quantities[itemKey] > 0 ? (
                            <div className="flex">
                              <button
                                onClick={(event) => addItem(event, itemKey)}
                                className="border-2 bg-slate-200 px-[8px] border-indigo-500/40 text-[17px] font-medium rounded-md"
                              >
                                +
                              </button>
                              <div className="mx-[8px]">
                                {quantities[itemKey]}
                              </div>
                              <button
                                onClick={(event) => deleteItem(event, itemKey)}
                                className="border-2 bg-slate-200 px-[7px] border-indigo-500/40 text-[17px] font-medium rounded-md"
                              >
                                -
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(event) => addItem(event, itemKey)}
                              className="text-primary cursor-pointer justify-center items-center"
                            >
                              <div>Add Item</div>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="w-[20%]">
                        <PriceFormatter
                          price={item.price * (quantities[itemKey] || 1)}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="w-[100%]">
              <div className="w-[100%] pt-[10px] h-[30px] mb-[20px] flex justify-center items-center">
                <div className="w-[100%] h-[50px] flex justify-center items-center">
                  <div className="w-[50%] mx-[10px]">
                    <select
                      className="pl-[15px] chalaja outline-none py-2 rounded-xl"
                      id="discount"
                      onChange={(e) => {
                        const selectedItem = fetchDiscount.find(
                          (item) => item.name === e.target.value
                        );
                        setDiscount(
                          selectedItem ? selectedItem.couponValue : ""
                        );

                        setDiscountType(
                          selectedItem ? selectedItem.couponType : ""
                        );
                      }}
                    >
                      <option selected>Apply Coupon</option>
                      {fetchDiscount?.map((item) => (
                        <option
                          className="py-2 flex justify-between items-center rounded-md chalaja"
                          key={item.name}
                          value={item.name}
                        >
                          <div>{item.name}</div>
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-[50%] mx-[10px]">
                    <select
                      className="pl-[15px] chalaja outline-none py-2 rounded-xl"
                      id="tax"
                      onChange={(e) => {
                        const selectedItem = fetchTax.find(
                          (item) => item.name === e.target.value
                        );
                        setTax(selectedItem ? selectedItem.taxPercentage : "");
                      }}
                    >
                      <option selected>Add Tax</option>
                      {fetchTax?.map((item) => (
                        <option
                          className="py-2 rounded-md chalaja"
                          key={item.name}
                          value={item.name}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="w-[100%] h-[50px] flex justify-between items-center">
                <button className="bg-primary w-[33%] mx-[10px] text-white py-3 rounded-md">
                  <PriceFormatter price={finalValue} />
                </button>

                {cartProduct?.length > 0 && (
                  <div className="flex w-[66.66%] justify-center items-center">
                    {kotGenerated === false ? (
                      isGeneratingInvoice === true ? (
                        <LoadingButton />
                      ) : (
                        <button
                          onClick={generateKOT}
                          className="bg-success text-[14px] flex justify-center items-center w-[50%] mx-[10px] text-white px-[15px] py-3 rounded-md"
                        >
                          <span className="mr-[5px]">
                            <FaDownload />
                          </span>
                          KOT
                        </button>
                      )
                    ) : isGeneratingInvoice === true ? (
                      <LoadingButton />
                    ) : (
                      <button
                        onClick={(e) => handleDownload(e)}
                        className="bg-success text-[14px] flex justify-center items-center w-[50%] mx-[10px] text-white px-[15px] py-3 rounded-md"
                      >
                        <span className="mr-[5px]">
                          <FaDownload />
                        </span>
                        Download
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setCheckout(true);
                      }}
                      className="bg-success w-[50%] mx-[10px] text-white px-[15px] py-3 rounded-md"
                    >
                      Proceed
                    </button>
                  </div>
                )}
                {cartProduct?.length == 0 && (
                  <div className="w-[66.66%] flex justify-center items-center">
                    <button className="bg-green-300 w-[50%] flex justify-center items-center mx-[10px] text-white px-[15px] py-3 rounded-md">
                      <span className="mr-[5px]">
                        <FaDownload />
                      </span>
                      KOT
                    </button>
                    <button className="bg-green-300 w-[50%] ml-[10px] text-white py-3 rounded-md">
                      Proceed
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div>
          {cartProduct?.length > 0 &&
            cartProduct.map((product) => {
              const itemKey = `${product._id}-${product.price}`;
              if (quantities[itemKey] > 0) {
                AddedProduct.push({ product, quantity: quantities[itemKey] });
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
            className="p-4 md:mt-[0px] bg-white mx-[10px] mb-[10px] flex flex-col md:flex-row md:p-5"
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
                                setSelectCustomerPhone(user.phone),
                                setSelectCustomerSince(user.createdAt);
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
                {addingOrder === false ? (
                  <button
                    onClick={(e) => formik.handleSubmit(e)}
                    className="bg-primary px-[10px] py-[5px] text-white rounded-md"
                  >
                    Add Order
                  </button>
                ) : (
                  <LoadingButton />
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
                                  setSelectCustomerPhone(user.phone),
                                  setSelectCustomerSince(user.createdAt);
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
                                  {/* {user.createdAt.toLocaleDateString('en-GB')} */}
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
                    {addingOrder === false ? (
                      <button
                        onClick={(e) => formik.handleSubmit(e)}
                        className="bg-primary px-[10px] py-[5px] text-white rounded-md"
                      >
                        Add Order
                      </button>
                    ) : (
                      <LoadingButton />
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
