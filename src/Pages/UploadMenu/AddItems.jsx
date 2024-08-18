import React, { useEffect, useState } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { getVariant, getCategory } from "../../helper/helper";
import { loader } from "../../assets/index";

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
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedVariant, setFetchedVariant] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [products, setProducts] = useState([
    {
      id: 1,
      productName: "",
      category: "",
      price: "",
      productType: "",
      variant: [{ id: 1, variant: "", value: "" }],
      shortCode: "",
    },
  ]);

  const [customInput, setCustomInput] = useState("");

   const handleSelectChange = (event) => {
     const { value } = event.target;
     const price = event.target
     setSelectedOption(value);

     // Update the variant in the products state
     setProducts((prevProducts) =>
       prevProducts.map((product) =>
         product.id === 1
           ? {
               ...product,
               variant: [{ id: 1, variant: value, price : price }],
             }
           : product
       )
     );
   };


  const handleInputChange = (e) => {
    setCustomInput(e.target.value);

    console.log(customInput);
  };

  const addItem = (e) => {
    e.preventDefault();
    setProducts([
      ...products,
      {
        id: products.length + 1,
        productName: "",
        category: "",
        price: "",
        productType: "",
        variant: [{ id: 1, variant: "", value: "" }],
        shortCode: "",
      },
    ]);
  };

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

  const handleName = (e, id) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, productName: e.target.value } : item
      )
    );
    // console.log(products);
  };

  const handlePrice = (e, id) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, price: e.target.value } : item
      )
    );
    console.log(products);
  };

  const handleCategory = (e, name, index) => {
    console.log("name", name);
    console.log("index", index);

    setProducts((prev) =>
      prev.map((item) =>
        item.id === index ? { ...item, category: name } : item
      )
    );
    console.log("pre", products);
  };

  console.log("vcsc", categories);

  const handleProductType = (e, name, id) => {
    console.log("name", name);
    console.log("id", id);

    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, productType: name } : item
      )
    );
    console.log(products);
  };

  const handleVariant = (e, name, value, id) => {
    console.log("name", name);
    console.log(value);
    console.log("id", id);

    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, variant: { variant: name, value: value } }
          : item
      )
    );
    console.log(products);
  };

  const handleShortCode = (e, id) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, shortCode: e.target.value } : item
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("products", products);
  };

  return (
    <>
      {!isLoading && (
        <div className="w-full">
          <div className="w-full chalaja">
            {products?.map((product, index) => {
              return (
                <div className="flex w-[100%] overflow-x-hidden chalaja sm:w-[770px] md:w-[1000px] lg:w-[1300px] overflow-x-scroll md:flex-row my-[15px]">
                  {/* <div className="">
                    <label
                      htmlFor="productName"
                      className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Item Name
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 min-w-[260px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Enter Item Name"
                      onChange={(e) => {
                        handleName(e, product.id);
                      }}
                    />
                  </div> */}

                  {/* <div className="min-w-[270px] mx-[10px]">
                    <label
                      htmlFor="type"
                      className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Category
                    </label>

                    <select
                      className="pl-[15px] chalaja outline-none py-2 rounded-xl"
                      id="category"
                      onChange={(e) =>
                        handleCategory(e, e.target.value, product.id)
                      }
                    >
                      <option selected>Select Category</option>
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
                  </div> */}

                  {/* <div className="ml-[20px]">
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
                      onChange={(e) => {
                        handlePrice(e, product.id);
                      }}
                    />
                  </div> */}

                  {/* <div className="min-w-[270px] mx-[10px]">
                    <label
                      htmlFor="type"
                      className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Product Type
                    </label>

                    <select
                      className="px-[15px] min-w-[270px] chalaja outline-none py-2 rounded-xl"
                      id="productType"
                      onChange={(e) =>
                        handleProductType(e, e.target.value, product.id)
                      }
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
                  </div> */}

                  <div className="min-w-[270px] mx-[10px]">
                    <label
                      htmlFor="variant"
                      className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Select Variant
                    </label>

                    <select
                      className="px-[15px] min-w-[270px] chalaja outline-none py-2 rounded-xl"
                      id="variant"
                      onChange={handleSelectChange}
                      value={selectedOption}
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
                          className="bg-red-500 z-100 h-[100px]"
                          value={customInput}
                          onChange={(e) => {handleInputChange(e)}}
                          placeholder="Enter custom value"
                        />
                        <h1>{selectedOption}</h1>
                        <h2>{customInput}</h2>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-center products-center">
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
                  handleSubmit(e);
                }}
                className="bg-success text-white text-sm font-medium py-2.5 px-5 rounded-lg"
              >
                Publish
              </button>
            </div>
          </div>
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

//  <div className=" mx-[10px]">
//    <label
//      htmlFor="price"
//      className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
//    >
//      Price
//    </label>
//    <input
//      onChange={(e) => {
//        handlePrice(e, item.id);
//      }}
//      type="text"
//      className="bg-gray-50 min-w-[270px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
//      placeholder="Enter Price"
//    />
//  </div>

// /

//  <div className="min-w-[270px] mx-[10px]">
//    <label
//      htmlFor="add-variant"
//      className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
//    >
//      Add Variant
//    </label>
//    <div className="">
//      <Select
//        className=""
//        products={fetchedVariant}
//        placeholder="Select Varaint"
//        labelPlacement="outside"
//        classNames={{
//          base: "max-w-xs",
//          trigger: "h-10",
//          radius: "none",
//        }}
//         onChange={(e) => handleVariant(e, item.id, e.target.value)}
//        renderValue={(products) =>
//          products.map((item) => (
//            <div
//              key={item.key}
//              className="flex pb-[2px] px-[4px] products-center gap-2"
//            >
//              <div className="flex flex-col">
//                <span>{item.data.name}</span>
//              </div>
//            </div>
//          ))
//        }
//      >
//        {(user) => (
//          <SelectItem key={user._id} textValue={user.name}>
//            <div
//              onClick={(e) => handleVariant(e, item.id, user.name)}
//              className="flex gap-2 py-[3px] px-[4px] products-center"
//            >
//              <div className="flex flex-col">
//                <span className="text-small">{user.name}</span>
//                <span className="text-tiny text-default-400">
//                  {user.phone}
//                </span>
//              </div>
//            </div>
//          </SelectItem>
//        )}
//      </Select>
//    </div>
//  </div>

//  <div className="ml-[10px]">
//    <label
//      htmlFor="short-code"
//      className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
//    >
//      Short Code
//    </label>
//    <input
//      onChange={(e) => {
//        handleShortCode(e, item.id);
//      }}
//     type="text"
//     className="bg-gray-50 min-w-[270px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
//     placeholder="Enter Short Code"
//   />
// </div>
