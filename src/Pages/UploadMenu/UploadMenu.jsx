import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { AiOutlineProduct } from "react-icons/ai";
import { RiBardLine } from "react-icons/ri";
import { CiBoxList } from "react-icons/ci";
import { LuPackagePlus } from "react-icons/lu";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { RiDiscountPercentLine } from "react-icons/ri";
import AddItems from "./AddItems";
import AddCategories from "./AddCategories";
import AddVariant from "./AddVariant";
import AddAddons from "./AddAddons";
import AddTax from "./AddTax";
import AddDiscount from "./AddDiscount";

const UploadMenu = () => {
  return (
    <div className="p-[20px] w-full w-full">
      <div className="flex text-[18px] overflow-x-scroll chalaja flex-col">
        <Tabs aria-label="Options" color="primary" variant="bordered">
          <Tab
            key="items"
            title={
              <div className="flex items-center space-x-2">
                <AiOutlineProduct />
                <span>Items</span>
              </div>
            }
          >
            <AddItems />
          </Tab>
          <Tab
            key="category"
            title={
              <div className="flex items-center space-x-2">
                <RiBardLine />
                <span>Categories</span>
              </div>
            }
          >
            <AddCategories />
          </Tab>
          <Tab
            key="variants"
            title={
              <div className="flex items-center space-x-2">
                <CiBoxList />
                <span>Variants</span>
              </div>
            }
          >
            <AddVariant />
          </Tab>
          <Tab
            key="addons"
            title={
              <div className="flex items-center space-x-2">
                <LuPackagePlus />
                <span>Addons</span>
              </div>
            }
          > <AddAddons /> </Tab>
          <Tab
            key="taxes"
            title={
              <div className="flex items-center space-x-2">
                <HiOutlineBuildingStorefront />
                <span>Taxes</span>
              </div>
            }
          > <AddTax /> </Tab>
          <Tab
            key="discount"
            title={
              <div className="flex items-center space-x-2">
                <RiDiscountPercentLine />
                <span>Discount</span>
              </div>
            }
          > <AddDiscount /> </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default UploadMenu;
