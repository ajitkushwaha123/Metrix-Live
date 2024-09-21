import React, { useEffect, useState } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { getVariant, getCategory, addProduct } from "../../helper/helper";
import { loader } from "../../assets/index";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";
import PriceFormatter from "../../helper/priceFormatter";
import { addItemValidate } from "../../helper/validate";

const productType = [
  { _id: 1, name: "Veg" },
  { _id: 2, name: "Non-Veg" },
  { _id: 3, name: "Egg" },
  { _id: 4, name: "Others" },
];

const variantType = [
  { key: 1, name: "small" },
  { key: 2, name: "medium" },
  { key: 3, name: "large" },
  { key: 4, name: "xl" },
];

const AddItems = () => {
  const [selectCategory, setSelectCategory] = useState("");
  const [selectProductType, setSelectProductType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedVariant, setFetchedVariant] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState();

  const fetchCategory = async () => {
    try {
      const { data } = await getCategory();
      console.log("Category data", data);
      setCategories(data.categories);
      console.log("Category fetched successfully", data.categories);
      console.log("cat", categories);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching category:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCategory();
  }, []);

  const fetchVariant = async () => {
    try {
      setIsLoading(true);
      const res = await getVariant();
      setFetchedVariant(res.data.variants);
      console.log("var", res.data.variants);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching variant:", error);
    }
  };

  useEffect(() => {
    fetchVariant();
  }, []);

  const formik = useFormik({
    initialValues: {
      productName: "",
      category: "",
      price: "",
      productType: "",
      variant: [],
      shortCode: "",
      stock: 0,
      status: "published",
    },
    validate: addItemValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      values.category = selectCategory;
      values.productType = selectProductType;
      values.variant = variants;
      console.log("val", values); 

      if(!values.category)
      {
        toast.error("Select Category ...!");
        setLoading(false);
        return ;
      }else if(!values.productType)
      {
        toast.error("Select Product Type ...!");
        setLoading(false);
        return ;
      }

      try {
        const addPromise = addProduct(values);
        // console.log("product Added", res);
        // toast.success("Product Added Successfully");

        toast.promise(addPromise , {
          loading: "Adding ...!",
          success: "Product Added Successfully!",
          error: "Error Adding Product. Please try again.",
        });

        await addPromise;
        setLoading(false);
      } catch (err) {
        console.log("Error ADDING PRODUCTS", err);
        // toast.error(`Error adding product ${err}`);
        setLoading(false);
      }
    },
  });

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleInputChange = (e) => {
    setCustomInput(e.target.value);
  };

  const addVariant = (e) => {
    e.preventDefault();
    const newVariant = { variant: selectedOption, value: customInput };
    setVariants([...variants, newVariant]);
    console.log([...variants, newVariant]);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      {!isLoading && (
        <div
          onSubmit={formik.handleSubmit}
          className="flex justify-center items-center w-full"
        >
          <div
            id="crud-modal"
            tabindex="-1"
            aria-hidden="true"
            class="overflow-y-auto overflow-x-hidden flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div class="p-4 max-w-2xl max-h-full">
              <div class="bg-white rounded-lg shadow dark:bg-gray-700">
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Create New Product
                  </h3>
                </div>

                <form class="p-4 md:p-5">
                  <div class="grid text-start gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                      <label
                        for="name"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        class="bg-gray-50 outline-none hover:border-2-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Type product name"
                        required=""
                        {...formik.getFieldProps("productName")}
                      />
                    </div>

                    <div class="col-span-2 sm:col-span-1">
                      <label
                        for="price"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        className="bg-gray-50 outline-none hover:border-2-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="₹0" 
                        required
                        {...formik.getFieldProps("price")}
                      />
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                      <label
                        for="category"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        class="bg-gray-50 outline-none hover:border-2-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectCategory}
                        onChange={(e) => setSelectCategory(e.target.value)}
                      >
                        <option selected="">Select category</option>
                        {categories?.map((item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div class="col-span-2 sm:col-span-1">
                      <label
                        for="stock"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Stock
                      </label>
                      <input
                        type="number"
                        name="stock"
                        id="stock"
                        class="bg-gray-50 outline-none hover:border-2-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder={"0"}
                        required=""
                        {...formik.getFieldProps("stock")}
                      />
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                      <label
                        for="productType"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Product Type
                      </label>
                      <select
                        id="product Type"
                        class="bg-gray-50 outline-none hover:border-2-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectProductType}
                        onChange={(e) => setSelectProductType(e.target.value)}
                      >
                        <option selected="">Select product Type</option>
                        {productType?.map((item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div class="col-span-2">
                      <label
                        for="shortCode"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Short Code
                      </label>
                      <input
                        type="text"
                        name="shortCode"
                        id="shortCode"
                        class="bg-gray-50 outline-none hover:border-2-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required=""
                        {...formik.getFieldProps("shortCode")}
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="variant"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Select Variant
                      </label>

                      <select
                        className="px-[15px] border-2-primary outline-none bg-gray-50 border-2 w-full py-2 rounded-xl"
                        id="variant"
                        value={selectedOption}
                        onChange={handleSelectChange}
                      >
                        <option value="" disabled>
                          Select Variant
                        </option>
                        {fetchedVariant.map((item) => (
                          <option
                            className="py-2 rounded-md chalaja"
                            key={item.name}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>

                      {selectedOption && (
                        <div className="flex my-[15px] justify-center items-center">
                          <input
                            type="text"
                            className="z-100 h-[40px] mr-[15px] w-[35%] outline-none border-2 rounded-xl px-2"
                            value={customInput}
                            onChange={handleInputChange}
                            placeholder="Variant Price"
                          />
                          <button
                            onClick={(e) => {
                              addVariant(e);
                            }}
                            className="mt-2 px-3 py-2 bg-primary rounded-xl text-white"
                          >
                            Add Variant
                          </button>
                        </div>
                      )}

                      <div className="justify-center mt-[10px] flex-col flex items-center">
                        <h3>Variants List : </h3>
                        <ul>
                          {variants.map((variant, index) => (
                            <li key={index}>
                              {variant.variant} :{" "}
                              <PriceFormatter price={variant.value} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center">
                    {!loading ? (
                      <button
                        type="submit"
                        onClick={formik.handleSubmit}
                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        <svg
                          className="me-1 -ms-1 w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        Add new product
                      </button>
                    ) : (
                      <LoadingButton />
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center items-center">
          <img src={loader} />
        </div>
      )}
    </>
  );
};

export default AddItems;
