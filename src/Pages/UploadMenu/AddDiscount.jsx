import React, { useState, useEffect } from "react";
import { loader, metrix } from "../../assets/index";
import { useNavigate } from "react-router-dom";
import {
  uploadDiscount,
  getDiscount,
  deleteDiscounts,
} from "../../helper/helper";
import toast, { Toaster } from "react-hot-toast";
import { RiDeleteBinLine } from "react-icons/ri";
import { Select, SelectItem } from "@nextui-org/react";
import LoadingButton from "../../components/LoadingButton"

const AddDiscount = () => {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const discounts = [
    { key: "percentage", label: "Percentage" },
    { key: "absolute", label: "Absolute" },
  ];
  const [fetchDiscount, setFetchDiscount] = useState([]);
  const [discount, setDiscount] = useState([
    {
      id: 1,
      name: "",
      couponValue: "",
      couponType: "",
    },
  ]);

  const deleteDiscount = async (e, id) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await deleteDiscounts(id);
      toast.success("Discount deleted successfully");
      fetchedDiscount();
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to delete discount");
      console.log(err);
      setIsLoading(false);
    }
  };

  const addNewDiscount = (e) => {
    e.preventDefault();
    setDiscount([
      ...discount,
      {
        id: discount.length + 1,
        name: "",
        couponValue: "",
        couponType: "",
      },
    ]);
  };

  const handleName = (e, id) => {
    setDiscount((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            name: e.target.value,
          };
        }
        return item;
      });
    });
  };

  const handleDiscountValue = (e, id) => {
    setDiscount((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            couponValue: e.target.value,
          };
        }
        return item;
      });
    });
  };

  const handleDiscountType = (e, id, selectedCoupon) => {
    console.log("selectedCoupon", selectedCoupon);
    setDiscount((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            couponType: selectedCoupon,
          };
        }
        return item;
      });
    });
  };

  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true)
    console.log(" sid ", discount);

    let flag = true;
    discount.map((item) => {
      if (
        item.name === "" ||
        item.couponValue === "" ||
        item.couponType === ""
      ) {
        toast.error("Please fill all the fields");
        flag = false;
        return;
      }
    });

    if (flag === false) {
      setLoading(false);
      return;
    } else {
      setIsLoading(true);
      try {
        const res = await uploadDiscount(discount);
        console.log(loading);
        toast.success("Discount Added Successfully");
        fetchedDiscount();
        setIsLoading(false);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to Add Discount");
        setIsLoading(false);
        setLoading(false);
      }
    }
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

  return (
    <div>
      <Toaster position="top-center" reverseOrder="false" />

      {isLoading && (
        <div className="flex justify-center items-center">
          <img src={loader} />
        </div>
      )}
      {!isLoading && (
        <div className="flex flex-col sm:flex-row">
          <div className="sm:hidden bg-white  p-5 rounded-sm my-[10px]">
            <form className="flex flex-col">
              {discount.map((item, index) => {
                return (
                  <div className="flex overflow-x-scroll chalaja my-[10px]">
                    <div className="col-span-2 min-w-[250px] max-w-[300px] mr-[10px] w-full sm:col-span-1">
                      <label
                        htmlFor="discountName"
                        className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Coupon Name
                      </label>
                      <input
                        onChange={(e) => {
                          handleName(e, item.id);
                        }}
                        type="text"
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter discount name"
                      />
                    </div>

                    <div className="col-span-2 min-w-[250px] max-w-[300px] mr-[10px] w-full sm:col-span-1">
                      <label
                        htmlFor="discountValue"
                        className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Discount Value
                      </label>
                      <input
                        onChange={(e) => {
                          handleDiscountValue(e, item.id);
                        }}
                        type="number"
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter discount Value"
                      />
                    </div>

                    <div className="col-span-2 min-w-[250px] max-w-[300px] mr-[10px] w-full sm:col-span-1">
                      <Select
                        label="Discount Type"
                        placeholder="Select discount type"
                        labelPlacement="outside"
                        className="max-w-xs border-2 rounded-xl"
                        disableSelectorIconRotation
                        required
                        // selectedKeys={discount.couponType}
                        onChange={(e) => {
                          handleDiscountType(e, item.id, e.target.value);
                        }}
                      >
                        {discounts.map((discount) => (
                          <SelectItem key={discount.key}>
                            {discount.label}
                          </SelectItem>
                        ))}
                      </Select>

                      {discount.couponType}
                    </div>
                  </div>
                );
              })}
            </form>

            <div className="flex my-[10px] justify-center items-center">
              <button
                onClick={(e) => {
                  addNewDiscount(e);
                }}
                className="bg-primary text-white text-sm font-medium py-2.5 px-5 rounded-lg"
              >
                Add Item
              </button>
              {!loading ? (
                <button
                  onClick={submitHandler}
                  className="bg-success ml-[30px] text-white text-sm font-medium h-[40px] px-5 rounded-lg"
                >
                  Add
                </button>
              ) : (
                <div>
                  <LoadingButton />
                </div>
              )}
            </div>
          </div>

          <div className="overflow-y-scroll mt-[20px] sm:mr-[40px] h-screen w-[100%] sm:w-[28%] h-[90%] chalaja overflow-y-scroll">
            <div className="h-[50px] cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center">
              Discounts
            </div>

            {fetchDiscount.length > 0 &&
              fetchDiscount.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="h-[50px] flex justify-between px-[40px] overflow-x-scroll chalaja cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white"
                  >
                    <h2>{item.name}</h2>
                    <h2>{item.couponValue}</h2>
                    {item.couponType === "percentage" && <h2>%</h2>}
                    {item.couponType === "absolute" && <h2>₹</h2>}
                    <button
                      onClick={(e) => {
                        deleteDiscount(e, item._id);
                      }}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                );
              })}

            {fetchDiscount.length === 0 && (
              <div className="flex justify-center bg-white flex-col items-center">
                <img
                  className=""
                  src="https://img.freepik.com/free-vector/pop-up-concept-illustration_114360-4411.jpg?t=st=1723327196~exp=1723330796~hmac=e00ea33d9d33dd9d089a686db2c5f0c7dc0cd687d28e273030eec48bea99256e&w=996"
                />
              </div>
            )}
          </div>

          <div className="hidden w-[70%] overflow-x-scroll chalaja sm:block">
            <form className="flex p-5 mt-[20px] overflow-x-scroll chalaja bg-white flex-col">
              {discount.map((item, index) => {
                return (
                  <div className="flex overflow-x-scroll chalaja my-[10px]">
                    <div className="col-span-2 min-w-[250px] max-w-[300px] mr-[10px] w-full sm:col-span-1">
                      <label
                        htmlFor="discountName"
                        className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Coupon Name
                      </label>
                      <input
                        onChange={(e) => {
                          handleName(e, item.id);
                        }}
                        type="text"
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter discount name"
                      />
                    </div>

                    <div className="col-span-2 min-w-[250px] max-w-[300px] mr-[10px] w-full sm:col-span-1">
                      <label
                        htmlFor="discountValue"
                        className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Discount Value
                      </label>
                      <input
                        onChange={(e) => {
                          handleDiscountValue(e, item.id);
                        }}
                        type="number"
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter discount value"
                      />
                    </div>

                    <div className="col-span-2 min-w-[250px] max-w-[300px] mr-[10px] w-full sm:col-span-1">
                      <Select
                        label="Discount Type"
                        placeholder="Select discount type"
                        labelPlacement="outside"
                        className="max-w-xs border-2 rounded-xl"
                        disableSelectorIconRotation
                        // selectedKeys={discount.couponType}
                        required
                        onChange={(e) => {
                          handleDiscountType(e, item.id, e.target.value);
                        }}
                      >
                        {discounts.map((discount) => (
                          <SelectItem key={discount.key}>
                            {discount.label}
                          </SelectItem>
                        ))}
                      </Select>

                      {discount.couponType}
                    </div>
                  </div>
                );
              })}
            </form>

            <div className="flex pb-[15px] bg-white justify-center items-center">
              <button
                onClick={(e) => {
                  addNewDiscount(e);
                }}
                className="bg-primary text-white text-sm font-medium py-2.5 px-5 rounded-lg"
              >
                Add Discount
              </button>
              {!loading ? (
                <button
                  onClick={submitHandler}
                  className="bg-success ml-[30px] text-white text-sm font-medium h-[40px] px-5 rounded-lg"
                >
                  Add
                </button>
              ) : (
                <div>
                  {" "}
                  <LoadingButton />{" "}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDiscount;
