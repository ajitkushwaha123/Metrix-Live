import React, { useEffect, useState } from "react";
import CategoryDrowpdown from "../../components/CategoryDrowpdown";
import { Select, SelectItem } from "@nextui-org/react";
import { getVariant, getCategory } from "../../helper/helper";

const productType = [
  { key: 1, name: "Veg" },
  { key: 2, name: "Non-Veg" },
  { key: 3, name: "Egg" },
  { key: 4, name: "Others" },
];

const variantType = [
  { key: 1, name: "small" },
  { key: 2, name: "medium" },
  { key: 3, name: "large" },
  { key: 4, name: "xl" },
];

const AddItems = () => {
  const [selectCategory, setSelectCategory] = useState("");
  const [fetchVariant, setFetchVariant] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [items, setItems] = useState([
    {
      id: 1,
      productName: "",
      category: "",
      price: "",
      productType: "",
      variant: "",
      shortCode: "",
    },
  ]);

  const addItem = (e) => {
    e.preventDefault();
    setItems([
      ...items,
      {
        id: items.length + 1,
        productName: "",
        category: "",
        price: "",
        productType: "",
        variant: "",
        shortCode: "",
      },
    ]);
  };

  const [category, setCategory] = useState([]);

  const fetchCategory = async () => {
    const response = await getCategory();
    console.log("Category data", response);
    setCategory(response.data.categories);
    console.log("Category fetched successfully", response.data.categories);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

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

  const handleName = (e, id) => {
    setItems((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            productName: e.target.value,
          };
        }
        return item;
      });
    });

    console.log(items);
  };
  
  const handlePrice = (e, id) => {
    setItems((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            price: e.target.value,
          };
        }
        return item;
      });
    });

    console.log(items);
  };



  const handleCategory = (e, name, index) => {
    console.log("name", name);
    console.log("index", index);

    setItems((prev) => {
      return prev.map((item) => {
        if (item.id === index) {
          return {
            ...item,
            category: name,
          };
        }
        return item;
      });
    });

    console.log(items);
  };

  const handleProductType = (e, id, name) => { 
    console.log("name", name);
    console.log("id", id);

    setItems((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            productType: name,
          };
        }
        return item;
      });
    });

    console.log(items);
  }

  const handleVariant = (e, id, name) => {
    console.log("name", name);
    console.log("id", id);

    setItems((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            variant: name,
          };
        }
        return item;
      });
    });

    console.log(items);
  }

  const handleShortCode = (e, id) => {

    setItems((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            shortCode: e.target.value,
          };
        }
        return item;
      });
    }
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("items", items);
  }

  return (
    <div className="w-full">
      <div className="w-full chalaja">
        {items.map((item) => {
          return (
            <div className="flex w-[100%] overflow-x-hidden chalaja sm:w-[770px] md:w-[1000px] lg:w-[1300px] overflow-x-scroll md:flex-row my-[15px]">
              <div className="">
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
                    handleName(e, item.id);
                  }}
                />
              </div>

              <div className="min-w-[270px] mx-[10px]">
                <label
                  htmlFor="category"
                  className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Category
                </label>
                <div className="pt-[3px] flex justify-center items-center">
                  <div className="min-w-[240px]">
                    <Select
                      className=""
                      items={category}
                      placeholder="Select a Category"
                      labelPlacement="outside"
                      classNames={{
                        base: "max-w-xs",
                        trigger: "h-10",
                        radius: "none",
                      }}
                      renderValue={(items) =>
                        items.map((data) => (
                          <div
                            key={data.key}
                            className="flex pb-[2px] px-[4px] items-center gap-2"
                          >
                            <div className="flex flex-col">
                              <span>{data.name}</span>
                            </div>
                          </div>
                        ))
                      }
                    >
                      {category.map((user, index) => (
                        <SelectItem key={user._id} textValue={user.name}>
                          <div
                            onClick={(e) => {
                              setSelectCategory(user.name);
                              handleCategory(e, user.name, item.id);
                            }}
                            className="flex gap-2 py-[3px] px-[4px] items-center"
                          >
                            <div className="flex flex-col">
                              <span className="text-small">{user.name}</span>
                              <span className="text-tiny text-default-400">
                                {user.phone}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className=" mx-[10px]">
                <label
                  htmlFor="price"
                  className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Price
                </label>
                <input
                  onChange={(e) => {
                    handlePrice(e, item.id);
                  }}
                  type="text"
                  className="bg-gray-50 min-w-[270px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter Price"
                />
              </div>

              <div className="min-w-[270px] mx-[10px]">
                <label
                  htmlFor="type"
                  className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Product Type
                </label>
                <div className="">
                  <Select
                    className=""
                    items={productType}
                    placeholder="Select Product Type"
                    labelPlacement="outside"
                    classNames={{
                      base: "max-w-xs",
                      trigger: "h-10",
                      radius: "none",
                    }}
                    renderValue={(items) =>
                      items.map((item) => (
                        <div
                          key={item.key}
                          className="flex pb-[2px] px-[4px] items-center gap-2"
                        >
                          <div className="flex flex-col">
                            <span>{item.data.name}</span>
                          </div>
                        </div>
                      ))
                    }
                  >
                    {productType.map((user, index) => (
                      <SelectItem key={user.key} textValue={user.name}>
                        <div
                          onChange={(e) =>
                            handleProductType(e, item.id, user.name)
                          }
                          className="flex gap-2 py-[3px] px-[4px] items-center"
                        >
                          <div className="flex flex-col">
                            <span className="text-small">{user.name}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="min-w-[270px] mx-[10px]">
                <label
                  htmlFor="add-variant"
                  className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Add Variant
                </label>
                <div className="">
                  <Select
                    className=""
                    items={fetchVariant}
                    placeholder="Select Varaint"
                    labelPlacement="outside"
                    classNames={{
                      base: "max-w-xs",
                      trigger: "h-10",
                      radius: "none",
                    }}
                    // onChange={(e) => handleVariant(e, item.id, e.target.value)}
                    renderValue={(items) =>
                      items.map((item) => (
                        <div
                          key={item.key}
                          className="flex pb-[2px] px-[4px] items-center gap-2"
                        >
                          <div className="flex flex-col">
                            <span>{item.data.name}</span>
                          </div>
                        </div>
                      ))
                    }
                  >
                    {(user) => (
                      <SelectItem key={user._id} textValue={user.name}>
                        <div
                          onClick={(e) => handleVariant(e, item.id, user.name)}
                          className="flex gap-2 py-[3px] px-[4px] items-center"
                        >
                          <div className="flex flex-col">
                            <span className="text-small">{user.name}</span>
                            <span className="text-tiny text-default-400">
                              {user.phone}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                </div>
              </div>

              <div className="ml-[10px]">
                <label
                  htmlFor="short-code"
                  className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Short Code
                </label>
                <input
                  onChange={(e) => {
                    handleShortCode(e, item.id);
                  }}
                  type="text"
                  className="bg-gray-50 min-w-[270px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter Short Code"
                />
              </div>
            </div>
          );
        })}

        <div className="flex justify-center items-center">
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
  );
};

export default AddItems;
