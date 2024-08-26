import React, { useEffect, useState } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { getVariant, getCategory, addProduct } from "../../helper/helper";
import { loader } from "../../assets/index";
import { useFormik } from "formik";
import toast , {Toaster} from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";


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
  const [selectedOption , setSelectedOption] = useState("");
  const [customInput , setCustomInput] = useState("");
  const [variants, setVariants] = useState([]);
  const [loading , setLoading] = useState(false);


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
      stock: "",
      status: "published",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      values.category = selectCategory;
      values.productType = selectProductType;
      values.variant = variants;
      console.log("val", values);

      try {
        const res = await addProduct(values);
        console.log("product Added", res);
        toast.success("Product Added Successfully");
        setLoading(false);
      } catch (err) {
        console.log("Error ADDING PRODUCTS", err);
        toast.error(`Error adding product ${err}`)
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
      {!isLoading && (
        <div className="w-full">
          <Toaster position="top-center" reverseOrder="false"></Toaster>
          <form
            className="flex justify-center items-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="max-w-[500px] flex justify-center items-center flex-col md:min-w-[400px] bg-white px-5 py-2">
              <div className="w-[100%] flex justify-center items-center flex-col py-[5px] my-[15px]">
                <div className="">
                  <label
                    htmlFor="productName"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Item Name
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 min-w-[260px] border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Item Name"
                    {...formik.getFieldProps("productName")}
                  />
                </div>

                <div className="my-[10px]">
                  <label
                    htmlFor="type"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Category
                  </label>

                  <select
                    className="border-2 bg-gray-50 max-w-[260px] outline-none py-2 rounded-xl"
                    id="category"
                    value={selectCategory}
                    onChange={(e) => setSelectCategory(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories?.map((item) => (
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

                <div className="my-[10px]">
                  <label
                    htmlFor="productPrice"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    className="bg-gray-50 min-w-[260px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Price"
                    {...formik.getFieldProps("price")}
                  />
                </div>

                <div className="my-[10px]">
                  <label
                    htmlFor="type"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Product Type
                  </label>

                  <select
                    className="px-[15px] bg-gray-50 min-w-[260px] border-2 py-2 rounded-xl"
                    id="productType"
                    value={selectProductType}
                    onChange={(e) => setSelectProductType(e.target.value)}
                  >
                    <option selected>Select Product Type</option>
                    {productType?.map((item) => (
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

                <div className="my-[10px]">
                  <label
                    htmlFor="shortCode"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Short Code
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 min-w-[260px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Price"
                    {...formik.getFieldProps("shortCode")}
                  />
                </div>

                <div className="my-[10px]">
                  <label
                    htmlFor="shortCode"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    className="bg-gray-50 min-w-[260px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter Price"
                    {...formik.getFieldProps("stock")}
                  />
                </div>

                <div className="min-w-[260px] my-[10px]">
                  <label
                    htmlFor="variant"
                    className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Variant
                  </label>

                  <select
                    className="px-[15px] bg-gray-50 border-2 min-w-[270px] py-2 rounded-xl"
                    id="variant"
                    value={selectedOption}
                    onChange={handleSelectChange}
                  >
                    <option value="" disabled>
                      Select Variant
                    </option>
                    <option value="noVariant">No Variant</option>
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
                    <div>
                      <input
                        type="text"
                        className="z-100 h-[40px] mr-[15px] w-[35%] outline-none border-2 rounded-xl px-2"
                        value={customInput}
                        onChange={handleInputChange}
                        placeholder="Variant Price"
                      />
                      <button
                        onClick={(e) => {addVariant(e)}}
                        className="mt-2 px-3 py-2 bg-primary rounded-xl text-white"
                      >
                        Add Variant
                      </button>
                    </div>
                  )}

                  <div>
                    <h3>Variants List : </h3>
                    <ul>
                      {variants.map((variant, index) => (
                        <li key={index}>
                          {variant.variant} : {variant.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-center products-center">
                {loading === true ? (
                  <LoadingButton />
                ) : (
                  <button className="bg-success text-white text-sm font-medium py-2.5 px-5 rounded-lg">
                    Publish
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
      {isLoading && (
        <div>
          <img src={loader} />
        </div>
      )}
    </>
  );
};

export default AddItems;
