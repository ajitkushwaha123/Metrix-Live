import React, { useState, useEffect } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import NewOrder from "../Pages/NewOrder"
import { getCategory } from "../helper/helper";
import axios from "axios";

export default function CategorySearch() {
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState('');

  console.log("Category data", selectCategory);

    const fetchCategory = async () => {
      const response = await getCategory();
      console.log("Category data", response);
      setCategory(response.data.categories);
      console.log("Category ed successfully", response.data.categories);

      console.log("Category data fetched successfully", category);
    };

  useEffect(() => {
    fetchCategory()
  }, []);

  return (
    <>
      <Select
        items={category}
        placeholder="Select a Category"
        labelPlacement="outside"
        classNames={{
          base: "max-w-xs",
          trigger: "h-12",
        }}
        renderValue={(items) =>
          items.map((item) => (
            <div
              key={item.key}
              className="flex py-[4px] px-[4px] items-center gap-2"
            >
              <Avatar
                alt={item.data.photo}
                className="flex-shrink-0"
                size="sm"
                src={item.data.photo}
                isBordered
                color="success"
              />
              <div className="flex flex-col">
                <span>{item.data.name}</span>
                <span className="text-default-500 text-tiny">
                  {/* {item.data.phone} */}
                </span>
              </div>
            </div>
          ))
        }
      >
        {(user) => (
          <SelectItem key={user._id} textValue={user.name}>
            <div
              onClick={() => setSelectCategory(user._id)}
              className="flex gap-2 py-[3px] px-[4px] items-center"
            >
              <Avatar
                isBordered
                // color={"suc"}
                alt={user.name}
                className="flex-shrink-0"
                size="sm"
                src={user.photo}
              />
              <div className="flex flex-col">
                <span className="text-small">{user.name}</span>
                <span className="text-tiny text-default-400">{user.phone}</span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
    </>
  );
}
