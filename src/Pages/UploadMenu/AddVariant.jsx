import React, { useState, useEffect } from "react";
import { loader, metrix } from "../../assets/index";
import { useNavigate } from "react-router-dom";
import { uploadVariant, getVariant, deleteVariants } from "../../helper/helper";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@nextui-org/react";
import { RiDeleteBinLine } from "react-icons/ri";
import LoadingButton from "../../components/LoadingButton";

const AddVariant = () => {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchVariant, setFetchVariant] = useState([]);
  const [variant, setVariant] = useState([
    {
      id: 1,
      name: "",
    },
  ]);

  const deleteVariant = async (e, id) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await deleteVariants(id);
      toast.success("Variant deleted successfully");
      fetchedVariant();
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to delete variant");
      console.log(err);
      setIsLoading(false);
    }
  };

  const addNewVariant = (e) => {
    e.preventDefault();
    setVariant([
      ...variant,
      {
        id: variant.length + 1,
        name: "",
      },
    ]);
  };

  const handleName = (e, id) => {
    setVariant((prev) => {
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
    e.preventDefault();
    setLoading(true);

    try {

      let flag = 0;
      {variant.map((item , index) => {
        if(item.name === "")
        {
          flag = 1;
        }
      })}

      if(flag)
      {
        toast.error("Please fill all the fields");
        setLoading(false);
        return ;
      }

      setIsLoading(true);

      const res = await uploadVariant(variant);
      toast.success("Variant Added Successfully");
      fetchedVariant();
      setLoading(false);
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to Add Variant");
      setIsLoading(false);
      setLoading(false);
    }
  };

  const fetchedVariant = async () => {
    try {
      const res = await getVariant();
      setFetchVariant(res.data.variants);
    } catch (error) {
      console.error("Error fetching variant:", error);
    }
  };

  useEffect(() => {
    fetchedVariant();
  }, []);

  return (
    <div>
      <Toaster position="top-center" reverseOrder="false" />

      {isLoading && (
        <div>
          {" "}
          <img src={loader} />{" "}
        </div>
      )}
      {!isLoading && (
        <div className="flex flex-col sm:flex-row">
          <div className="sm:hidden bg-white p-5 rounded-sm my-[10px]">
            <form className="flex flex-col">
              {variant.map((item, index) => {
                return (
                  <div className="flex my-[10px] justify-center items-center">
                    <div className="col-span-2 min-w-[260px] max-w-[300px] sm:mr-[10px] w-full sm:col-span-1">
                      <label
                        htmlFor="categoryName"
                        className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Variant Name
                      </label>
                      <input
                        onChange={(e) => {
                          handleName(e, item.id);
                        }}
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter variant name"
                      />
                    </div>
                  </div>
                );
              })}
            </form>

            <div className="flex my-[10px] justify-center items-center">
              <button
                onClick={(e) => {
                  addNewVariant(e);
                }}
                className="bg-primary text-white text-sm font-medium py-2.5 px-5 rounded-lg"
              >
                Add Item
              </button>
              {!loading ? (
                <button
                  onClick={(e) => {
                    submitHandler(e);
                  }}
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

          <div className="overflow-y-scroll mt-[20px] sm:mr-[40px] h-screen w-[100%] sm:w-[28%] h-[90%] chalaja overflow-y-scroll">
            <div className="h-[50px] cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center">
              Variants
            </div>

            {fetchVariant.length > 0 &&
              fetchVariant.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="h-[50px] flex justify-between px-[40px] overflow-x-scroll chalaja cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white"
                  >
                    <h2>{item.name}</h2>
                    <button
                      onClick={(e) => {
                        deleteVariant(e, item._id);
                      }}
                    >
                      {" "}
                      <RiDeleteBinLine />{" "}
                    </button>
                  </div>
                );
              })}

            {fetchVariant.length === 0 && (
              <div className="flex justify-center bg-white flex-col items-center">
                <img
                  className=""
                  src="https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150696458.jpg?ga=GA1.1.493555557.1723323306&semt=ais_hybrid"
                />
              </div>
            )}
          </div>

          <div className="hidden sm:block">
            <form className="flex p-5 mt-[20px] bg-white flex-col">
              {variant.map((item, index) => {
                return (
                  <div className="flex my-[10px] justify-center items-center">
                    <div className="col-span-2 min-w-[280px] max-w-[300px] mr-[10px] w-full sm:col-span-1">
                      <label
                        htmlFor="categoryName"
                        className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Variant Name
                      </label>
                      <input
                        onChange={(e) => {
                          handleName(e, item.id);
                        }}
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter variant name"
                      />
                    </div>
                  </div>
                );
              })}
            </form>

            <div className="flex pb-[15px] bg-white justify-center items-center">
              <button
                onClick={(e) => {
                  addNewVariant(e);
                }}
                className="bg-primary text-white text-sm font-medium py-2.5 px-5 rounded-lg"
              >
                Add Variant
              </button>
              {!loading ? (
                <button
                  onClick={(e) => {
                    submitHandler(e);
                  }}
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

export default AddVariant;
