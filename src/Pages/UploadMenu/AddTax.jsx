import React, { useState, useEffect } from "react";
import { loader, metrix } from "../../assets/index";
import { useNavigate } from "react-router-dom";
import { uploadTax, getTax, deleteTax } from "../../helper/helper";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@nextui-org/react";
import { RiDeleteBinLine } from "react-icons/ri";

const AddTax = () => {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchTax, setFetchTax] = useState([]);
  const [tax, setTax] = useState([
    {
      id: 1,
      name: "",
    },
  ]);

  const deleteTaxes = async (e, id) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await deleteTax(id);
      toast.success("Tax deleted successfully");
      fetchedTax();
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to delete tax");
      console.log(err);
      setIsLoading(false);
    }
  };

  const addNewTax = (e) => {
    e.preventDefault();
    setTax([
      ...tax,
      {
        id: tax.length + 1,
        name: "",
      },
    ]);
  };

  const handleName = (e, id) => {
    setTax((prev) => {
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

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const res = await uploadTax(tax);
      toast.success("Tax Added Successfully");
      fetchedTax();
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to Add Tax");
      setIsLoading(false);
    }
  };

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

  return (
    <div>
      <Toaster position="top-center" reverseOrder="false" />

      {isLoading && (
        <div>
          <img src={loader} />
        </div>
      )}
      {!isLoading && (
        <div className="flex flex-col sm:flex-row">
          <div className="sm:hidden bg-white p-5 rounded-sm my-[10px]">
            <form className="flex flex-col">
              {tax.length > 0 &&
                tax.map((item, index) => {
                  return (
                    <div className="flex my-[10px] justify-center items-center">
                      <div className="col-span-2 min-w-[260px] max-w-[300px] sm:mr-[10px] w-full sm:col-span-1">
                        <label
                          htmlFor="categoryName"
                          className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Tax Name
                        </label>
                        <input
                          onChange={(e) => {
                            handleName(e, item.id);
                          }}
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Enter tax name"
                        />
                      </div>
                    </div>
                  );
                })}
            </form>

            <div className="flex my-[10px] justify-center items-center">
              <button
                onClick={(e) => {
                  addNewTax(e);
                }}
                className="bg-primary text-white text-sm font-medium py-2.5 px-5 rounded-lg"
              >
                Add Item
              </button>
              {!loading && (
                <button
                  onClick={(e) => {
                    submitHandler(e);
                    setLoading(true);
                  }}
                  className="bg-success ml-[30px] text-white text-sm font-medium h-[40px] px-5 rounded-lg"
                >
                  Add
                </button>
              )}
              {loading && (
                <Button color="primary" isLoading>
                  Loading
                </Button>
              )}
            </div>
          </div>

          <div className="overflow-y-scroll mt-[20px] sm:mr-[40px] h-screen w-[100%] sm:w-[28%] h-[90%] chalaja overflow-y-scroll">
            <div className="h-[50px] cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center">
              Tax
            </div>

            {fetchTax.length > 0 &&
              fetchTax.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="h-[50px] flex justify-between px-[40px] overflow-x-scroll chalaja cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white"
                  >
                    <h2>{item.name}</h2>
                    <button
                      onClick={(e) => {
                        deleteTaxes(e, item._id);
                      }}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                );
              })}

            {fetchTax.length === 0 && (
              <div className="flex justify-center bg-white flex-col items-center">
                <img
                  className=""
                  src="https://img.freepik.com/premium-vector/online-tax-payment-flat-illustration-vector-template_773186-1100.jpg?w=900"
                />
              </div>
            )}
          </div>

          <div className="hidden sm:block">
            <form className="flex p-5 mt-[20px] bg-white flex-col">
              {tax.map((item, index) => {
                return (
                  <div className="flex my-[10px] justify-center items-center">
                    <div className="col-span-2 min-w-[280px] max-w-[300px] mr-[10px] w-full sm:col-span-1">
                      <label
                        htmlFor="categoryName"
                        className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Tax Name
                      </label>
                      <input
                        onChange={(e) => {
                          handleName(e, item.id);
                        }}
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter tax name"
                      />
                    </div>
                  </div>
                );
              })}
            </form>

            <div className="flex pb-[15px] bg-white justify-center items-center">
              <button
                onClick={(e) => {
                  addNewTax(e);
                }}
                className="bg-primary text-white text-sm font-medium py-2.5 px-5 rounded-lg"
              >
                Add Tax
              </button>
              <button
                onClick={(e) => {
                  submitHandler(e);
                }}
                className="bg-success ml-[30px] text-white text-sm font-medium h-[40px] px-5 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTax;
