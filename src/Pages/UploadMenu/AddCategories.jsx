import React, { useState, useEffect } from "react";
import { loader, metrix } from "../../assets/index";
import { useNavigate } from "react-router-dom";
import { uploadCategory , getCategory } from "../../helper/helper";
import toast, { Toaster } from "react-hot-toast";

const AddCategories = () => {

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([
    {
      id: 1,
      name: "",
    },
  ]);

  const addItem = (e) => {
    e.preventDefault();
    setCategory([
      ...category,
      {
        id: category.length + 1,
        name: "",
      },
    ]);
  };

  const [name, setName] = useState("");

  const handleName = (e, id) => {
    console.log(id);

    setCategory((prev) => {
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

    console.log(category);
  };

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log(category);

    try {
      const res = await uploadCategory(category);
      toast.success("Category Added Successfully");
    } catch (err) {
      toast.error("Failed to Add Category");
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await getCategory();
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div>
      <Toaster position="top-center" reverseOrder="false" />

      <div className="flex flex-col sm:flex-row">
        <div className="sm:hidden bg-white p-5 rounded-md my-[10px]">
          <form className="flex flex-col">
            {category.map((item, index) => {
              return (
                <div className="flex my-[10px] justify-center items-center">
                  <div className="col-span-2 min-w-[260px] max-w-[300px] sm:mr-[10px] w-full sm:col-span-1">
                    <label
                      htmlFor="categoryName"
                      className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Category Name
                    </label>
                    <input
                      onChange={(e) => {
                        handleName(e, item.id);
                      }}
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Enter category name"
                    />
                  </div>
                </div>
              );
            })}
          </form>

          <div className="flex my-[10px] justify-center items-center">
            <button
              onClick={(e) => {
                addItem(e);
              }}
              className="bg-primary text-white text-sm font-medium py-2.5 px-5 rounded-lg"
            >
              Add Item
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

        <div className="overflow-y-scroll md:mr-[40px] h-screen w-[100%] md:w-[25%] h-[90%] chalaja overflow-y-scroll">
          <div className="h-[50px] cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center">
            Categories
          </div>

          {categories.map((item, index) => {
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

        <div className="hidden ml-[20px] sm:block">
          <form className="flex p-5  bg-white flex-col">
            {category.map((item, index) => {
              return (
                <div className="flex my-[10px] justify-center items-center">
                  <div className="col-span-2 min-w-[280px] max-w-[300px] mr-[10px] w-full sm:col-span-1">
                    <label
                      htmlFor="categoryName"
                      className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Category Name
                    </label>
                    <input
                      onChange={(e) => {
                        handleName(e, item.id);
                      }}
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Enter category name"
                    />
                  </div>
                </div>
              );
            })}
          </form>

          <div className="flex pb-[15px] bg-white justify-center items-center">
            <button
              onClick={(e) => {
                addItem(e);
              }}
              className="bg-primary text-white text-sm font-medium py-2.5 px-5 rounded-lg"
            >
              Add Item
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
    </div>
  );
};

export default AddCategories;
