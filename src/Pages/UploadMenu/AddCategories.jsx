import React, { useState, useEffect } from "react";
import { loader, metrix } from "../../assets/index";
import { useNavigate } from "react-router-dom";
import { uploadCategory , getCategory , deleteCategory  } from "../../helper/helper";
import toast, { Toaster } from "react-hot-toast";
import { RiDeleteBinLine } from "react-icons/ri";

const AddCategories = () => {

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const deleteCategories = async (e, id , imageUrl) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await deleteCategory(id , imageUrl);
      toast.success("Category deleted successfully");
      fetchCategory();
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to delete category");
      console.log(err);
      setIsLoading(false);
    }
  };

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
      let flag = 0;
      {category.map((item , index) => {
        if(item.name == "")flag = 1;
      })}

      if(flag)
      {
        toast.error("Please fill all the fields");
        return;
      }

      setIsLoading(true);
      const res = await uploadCategory(category);
      toast.success("Category Added Successfully");
      fetchCategory();
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to Add Category");
      console.log(err);
      setIsLoading(false);
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

      {!isLoading && (
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
                        required="true"
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

            {categories.length > 0 &&
              categories.map((item, index) => {
                return (
                  <div
                    // onClick={() => fetchProduct(item._id)}
                    key={index}
                    className="h-[50px] flex justify-between items-center px-[40px] overflow-x-scroll chalaja cursor-pointer border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white"
                  >
                    {item.name}
                    <RiDeleteBinLine
                      onClick={(e) => deleteCategories(e, item._id, item.photo)}
                    />
                  </div>
                );
              })}
            {categories.length === 0 && (
              <div className="flex justify-center bg-white flex-col items-center">
                <img
                  className=""
                  src="https://img.freepik.com/free-vector/removing-goods-from-basket-refusing-purchase-changing-decision-item-deletion-emptying-trash-online-shopping-app-laptop-user-cartoon-character_335657-1172.jpg?t=st=1723367182~exp=1723370782~hmac=55962625ffef80d292990c86324b613700e6bceb335c3ac23eea1d5e10860567&w=740"
                />
              </div>
            )}
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
      )}
      {isLoading && <div> <img src={loader} /> </div>}
    </div>
  );
};

export default AddCategories;
