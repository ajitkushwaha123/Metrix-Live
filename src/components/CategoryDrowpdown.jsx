import React, { useState , useEffect } from 'react'
import { Select, SelectItem } from '@nextui-org/react'
import { Avatar } from '@nextui-org/react'
import { getCategory} from '../helper/helper'


const CategoryDrowpdown = () => {

    const [category , setCategory] = useState([]);
    const [selectCategory , setSelectCategory] = useState("");

     const fetchCategory = async () => {
       const response = await getCategory();
       console.log("Category data", response);
       setCategory(response.data.categories);
       console.log("Category ed successfully", response.data.categories);

       console.log("Category data fetched successfully", category);
     };

     useEffect(() => {
       fetchCategory();
     }, []);
  return (
    <div>
      <div className="pt-[3px] flex justify-center items-center">
        <div className="min-w-[240px]">
          <Select
            className=''
            items={category}
            placeholder="Select a Category"
            labelPlacement="outside"
            classNames={{
              base: "max-w-xs",
              trigger: "h-10",
              radius : "none",
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
    </div>
  );
}

export default CategoryDrowpdown
