import React, { useState, useEffect } from "react";
import { loader, metrix } from "../../assets/index";
import { useNavigate } from "react-router-dom";
import { uploadAddons, getAddons, deleteAddon } from "../../helper/helper";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@nextui-org/react";
import { RiDeleteBinLine } from "react-icons/ri";
import LoadingButton from "../../components/LoadingButton";

const AddAddons = () => {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchAddons, setFetchAddons] = useState([]);
  const [addons, setAddons] = useState([
    {
      id: 1,
      name: "",
    },
  ]);

  const deleteAddons = async (e, id) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await deleteAddon(id);
      toast.success("Addons deleted successfully");
      fetchedAddons();
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to delete addons");
      console.log(err);
      setIsLoading(false);
    }
  };

  const addNewAddons = (e) => {
    e.preventDefault();
    setAddons([
      ...addons,
      {
        id: addons.length + 1,
        name: "",
      },
    ]);
  };

  const handleName = (e, id) => {
    setAddons((prev) => {
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
    setLoading(true);
    setIsLoading(true);
    e.preventDefault();

    try {
      console.log("asd" , addons);

      let flag = 0;

      {addons.map((item , index) => {
        if(item.name === "")
        {
          flag = 1;
        }
      })}

      if(flag == 1)
      {
        toast.error("Please fill all the fields ")
        setLoading(false);
        setIsLoading(false);
        return;
      }
      const res = await uploadAddons(addons);
      toast.success("Addons Added Successfully");
      fetchedAddons();
      setIsLoading(false);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to Add Addons");
      setIsLoading(false);
      setLoading(false);
    }
  };

  const fetchedAddons = async () => {
    try {
      const res = await getAddons();
      setFetchAddons(res.data.addons);
    } catch (error) {
      console.error("Error fetching addons:", error);
    }
  };

  useEffect(() => {
    fetchedAddons();
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
          <div className="sm:hidden bg-white p-5 rounded-sm my-[10px]">
            <form className="flex flex-col">
              {addons.length > 0 &&
                addons.map((item, index) => {
                  return (
                    <div className="flex my-[10px] justify-center items-center">
                      <div className="col-span-2 min-w-[260px] max-w-[300px] sm:mr-[10px] w-full sm:col-span-1">
                        <label
                          htmlFor="categoryName"
                          className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Addons Name
                        </label>
                        <input
                          onChange={(e) => {
                            handleName(e, item.id);
                          }}
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Enter addons name"
                        />
                      </div>
                    </div>
                  );
                })}
            </form>

            <div className="flex my-[10px] justify-center items-center">
              <button
                onClick={(e) => {
                  addNewAddons(e);
                }}
                className="bg-primary text-white text-sm font-medium py-2.5 px-5 rounded-lg"
              >
                Add Addons
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
              ) : <div> <LoadingButton /> </div>}
            </div>
          </div>

          <div className="overflow-y-scroll mt-[20px] sm:mr-[40px] h-screen w-[100%] sm:w-[28%] h-[90%] chalaja overflow-y-scroll">
            <div className="h-[50px] cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center">
              Addons
            </div>

            {fetchAddons.length > 0 &&
              fetchAddons.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="h-[50px] flex justify-between px-[40px] overflow-x-scroll chalaja cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white"
                  >
                    <h2>{item.name}</h2>
                    <button
                      onClick={(e) => {
                        deleteAddons(e, item._id);
                      }}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                );
              })}

            {fetchAddons.length === 0 && (
              <div className="flex justify-center bg-white flex-col items-center">
                <img
                  className=""
                  src="https://img.freepik.com/free-vector/removing-goods-from-basket-refusing-purchase-changing-decision-item-deletion-emptying-trash-online-shopping-app-laptop-user-cartoon-character-vector-isolated-concept-metaphor-illustration_335657-2843.jpg?t=st=1723387200~exp=1723390800~hmac=cd84bb500df5699d060a63849cc5e2bbb17b2772cd8e0280fff1ce4b4069b06a&w=740"
                />
              </div>
            )}
          </div>

          <div className="hidden sm:block">
            <form className="flex p-5 mt-[20px] bg-white flex-col">
              {addons.map((item, index) => {
                return (
                  <div className="flex my-[10px] justify-center items-center">
                    <div className="col-span-2 min-w-[280px] max-w-[300px] mr-[10px] w-full sm:col-span-1">
                      <label
                        htmlFor="categoryName"
                        className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Addons Name
                      </label>
                      <input
                        onChange={(e) => {
                          handleName(e, item.id);
                        }}
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter addons name"
                      />
                    </div>
                  </div>
                );
              })}
            </form>

            <div className="flex pb-[15px] bg-white justify-center items-center">
              <button
                onClick={(e) => {
                  addNewAddons(e);
                }}
                className="bg-primary text-white text-sm font-medium py-2.5 px-5 rounded-lg"
              >
                Add Addons
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
              ) : <div> <LoadingButton /> </div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAddons;
