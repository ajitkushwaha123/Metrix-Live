import React, { useState } from 'react'
import CategoryDrowpdown from '../../components/CategoryDrowpdown';
import { Select, SelectItem } from '@nextui-org/react'

const productType = [
    {key : 1 , name : "Veg"},
    {key : 2 , name : "Non-Veg"},
    {key : 3 , name : "Egg"},
    {key : 4 , name : "Others"}
]

const variantType = [
  { key: 1, name: "small" },
  { key: 2, name: "medium" },
  { key: 3, name: "large" },
  { key: 4, name: "xl" },
];

const AddItems = () => {
    const [items , setItems] = useState([{id : 1 , productName : "" , category : "" , price : "" , productType : "" , variant : "" , shortCode : ""}]);

    const addItem = (e) => {
        e.preventDefault();
        setItems([...items , {id : items.length + 1 , productName : "" , category : "" , price : "" , productType : "" , variant : "" , shortCode : ""}])
    }
  return (
    <div>
      {items.map((item) => {
        return (
          <div className="flex md:flex-row my-[15px] overflow-x-scroll chalaja">
            <div className="col-span-2 min-w-[240px] mr-[10px] w-full sm:col-span-1">
              <label
                htmlFor="productName"
                className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Item Name
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter Item Name"
              />
            </div>

            <div className="col-span-2 min-w-[240px] mx-[10px] w-full sm:col-span-1">
              <label
                htmlFor="category"
                className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Category
              </label>
              <CategoryDrowpdown />
            </div>

            <div className="col-span-2 min-w-[240px] mx-[10px] w-full sm:col-span-1">
              <label
                htmlFor="price"
                className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Price
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter Price"
              />
            </div>

            <div className="col-span-2 min-w-[240px] mx-[10px] w-full sm:col-span-1">
              <label
                htmlFor="type"
                className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Product Type
              </label>
              <div className="min-w-[240px]">
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
                  {(user) => (
                    <SelectItem key={user._id} textValue={user.name}>
                      <div
                        onClick={() => setSelectCategory(user.name)}
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

            <div className="col-span-2 min-w-[240px] mx-[10px] w-full sm:col-span-1">
              <label
                htmlFor="add-variant"
                className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Add Variant
              </label>
              <div className="min-w-[240px]">
                <Select
                  className=""
                  items={variantType}
                  placeholder="Select Varaint"
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
                  {(user) => (
                    <SelectItem key={user._id} textValue={user.name}>
                      <div
                        onClick={() => setSelectCategory(user.name)}
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

            <div className="col-span-2 min-w-[240px] ml-[10px] w-full sm:col-span-1">
              <label
                htmlFor="short-code"
                className="block text-primary text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Short Code
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter Short Code"
              />
            </div>
          </div>
        );
      })}

      <button onClick={(e) => {addItem(e)}} className="bg-primary text-white text-sm font-medium py-2.5 px-5 rounded-lg">
        Add Item
      </button>
    </div>
  );
}

export default AddItems
