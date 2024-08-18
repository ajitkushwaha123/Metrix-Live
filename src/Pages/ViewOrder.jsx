import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSingleOrders,
  updateOrder as updateOrderHelper,
} from "../helper/helper";
import BreadCrum from "../components/BreadCrum";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { MdOutlinePayment } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import SingleOrderTable from "../DataTable/SingleOrderTable";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import PriceFormatter from "../helper/priceFormatter";

const ViewOrder = () => {
  const { id } = useParams();
  console.log("id:", id);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [orderType, setOrderType] = useState("");
  const [orderedStatus, setOrderedStatus] = useState("pending");
  const [orderDate , setOrderDate] = useState("");
  const [customerSince , setCustomerSince] = useState();
  const [customerStatus , setCustomerStatus] = useState("True");
  const [invoiceId ,setInvoiceId] = useState('');
  const [discount , setDiscount] = useState(0);
  const [tax , setTax] = useState(0);
  const [discountType , setDiscountType] = useState("percentage");

  const fetchProduct = async () => {
    try {
      console.log("Fetching product with id:", id);
      const product = await getSingleOrders(`orders/find/${id}`);
      console.log("Fetched product:", product);

      // Format the date
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };

      const option = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };

      const formattedDate = new Date(product.createdAt).toLocaleDateString(
        "en-US",
        options
      );

      const formateCustomerSince = new Date(product.customerSince).toLocaleDateString(
        "en-US",
        option
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
      setOrderedStatus(product.orderStatus);
      setCustomerSince(formateCustomerSince);
      setCustomerStatus(product.newCustomer.toString());
      setInvoiceId(product.invoiceId);
      setDiscount(product.discount);
      setTax(product.tax);
      setDiscountType(product.discountType);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };


  const updateOrder = async (id, orderStatus) => {
    try {
      const { data } = await updateOrderHelper(
        `orders/${id}`,
        orderStatus
      );
      console.log("Updated order data:", data);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleCancelOrder = (e) => {
    e.preventDefault();
    setOrderedStatus("cancelled");
    formik.handleSubmit();
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    setOrderedStatus("completed");
    formik.handleSubmit();
  };

  const formik = useFormik({
    initialValues: {
      orderStatus: "published",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (orderedStatus === "cancelled") {
        values.orderStatus = "cancelled";
        toast.success("Order Cancelled Successfully ...!");
      }

      if (orderedStatus === "completed") {
        values.orderStatus = "completed";
        toast.success("Order completed Successfully ...!");
      }
      console.log("Formik values:", values);
      console.log("Ordered status:", id);
      let updateOrderPromise = updateOrder(id, values);
      toast.promise(updateOrderPromise, {
        loading: "Updating...",
        success: <b>Order Updated Successfully!</b>,
        error: <b>Error Updating Order!</b>,
      });
    },
  });

  return (
    <div>
      <BreadCrum title={"Inventory"} back={"/"} />

      <Toaster position="top-center" reverseOrder="false"></Toaster>

      <div className="px-[20px] md:px-[40px]">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex">
            <p className="mr-[30px] font-medium">
              Order :<span className="text-slate-500 ml-[10px]">#2806</span>
            </p>
            <p className="mr-[30px] text-[18px] text-slate-500">
              <span className="font-medium text-black text-[18px]">
                Dated :
              </span>
              {orderDate}
            </p>
          </div>

          <div className="flex my-[15px] md:py-[0px] justify-center items-center">
            <button
              onClick={(e) => {
                handleCancelOrder(e);
              }}
              className="bg-black mx-[15px] rounded-lg flex justify-center items-center text-white px-6 text-[18px] py-2"
            >
              <MdOutlineArrowDropDown className="mr-[15px]" />
              {orderedStatus === "cancelled" ? (
                <p>Cancelled</p>
              ) : (
                <p>
                  {" "}
                  <span>Mark as Cancel</span>{" "}
                </p>
              )}
            </button>
            <button
              onClick={(e) => {
                handleCompleteOrder(e);
              }}
              className="bg-primary rounded-lg flex justify-center items-center text-white px-6 text-[18px] py-2"
            >
              {orderedStatus === "completed" ? (
                <p>Completed</p>
              ) : (
                <p>
                  <span>Mark as Complete</span>
                </p>
              )}
            </button>
          </div>
        </div>

        <div className="py-[10px] md:py-[30px]">
          <div className="flex flex-col md:flex-row">
            <div className="md:mx-[20px] bg-[white] my-[10px] md:my-[1px] pb-[15px] rounded-xl w-[100%] md:w-[33%]">
              <div className="flex justify-between p-5">
                <div className="flex justify-center items-center">
                  <p className="bg-secondary mr-[15px] text-[24px] text-primary p-2 rounded-lg">
                    <CiUser />
                  </p>
                  <div className="text-start text-slate-500">
                    <h2 className="text-black">
                      {customerName || <Skeleton width={80} />}
                    </h2>
                    <h3>
                      Customer since :
                      <span className="font-medium text-black">
                        {" "}
                        {customerSince}{" "}
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="">
                  <h2 className="bg-secondary text-primary rounded-md p-1">
                    {status}
                  </h2>
                </div>
              </div>

              <div className="flex">
                <div className="flex text-start w-[100%] px-[18px]">
                  <div className="w-[50%]">
                    <h2 className="text-slate-400">
                      Phone : <br />
                      <span className="text-black">
                        {phone || <Skeleton width={100} />}
                      </span>
                    </h2>
                  </div>

                  <div className="w-[50%]">
                    <h2 className="text-slate-400">
                      Total amount :
                      <br />
                      {discountType === "percentage" ? (
                        <span className="text-black">
                          {(
                            <PriceFormatter
                              price={price + (price * tax) / 100 - (price * discount)/100}
                            />
                          ) || <Skeleton width={50} />}
                        </span>
                      ) : (
                        <span className="text-black">
                          {(
                            <PriceFormatter
                              price={price + (price * tax) / 100 - discount}
                            />
                          ) || <Skeleton width={50} />}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:mx-[20px] bg-[white] my-[10px] md:my-[1px] pb-[15px] rounded-xl w-[100%] md:w-[33%]">
              <div className="flex justify-between p-5">
                <div className="flex justify-center items-center">
                  <p className="bg-secondary mr-[15px] text-[24px] text-primary p-2 rounded-lg">
                    <CiLocationOn />
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex w-[100%] text-start px-[18px]">
                  <div className="w-[50%]">
                    <h2 className="text-slate-400">
                      Order Status : <br />
                      <span className="text-black text-medium text-[17px] px-[3px]">
                        {orderedStatus.toLocaleUpperCase() || (
                          <Skeleton width={20} />
                        )}
                      </span>
                    </h2>
                  </div>
                  <div className="w-[50%]">
                    <h2 className="text-slate-400">
                      New Customer :
                      <br />
                      <span className="text-black text-[17px] px-[3px]">
                        {customerStatus}
                      </span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:mx-[20px] bg-[white] my-[10px] md:my-[1px] pb-[15px] w-[100%] rounded-xl md:w-[33%]">
              <div className="flex justify-between p-5">
                <div className="flex justify-center items-center">
                  <p className="bg-secondary mr-[15px] text-[24px] text-primary p-2 rounded-lg">
                    <MdOutlinePayment />
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex w-[100%] text-start px-[18px]">
                  <div className="w-[50%]">
                    <h2 className="text-slate-400">
                      Payment Method : <br />
                      <span className="text-black">
                        {paymentType || <Skeleton width={60} />}
                      </span>
                    </h2>
                  </div>
                  <div className="w-[50%]">
                    <h2 className="text-slate-400">
                      Order Type :
                      <br />
                      <span className="text-black">
                        {orderType || <Skeleton width={80} />}
                      </span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white pt-8 mb-8 px-4">
          <SingleOrderTable invoice={invoiceId} />
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
