import { React, useContext } from "react";
import Navbar from "../components/Navbar";
import BreadCrum from "../components/BreadCrum";
import AddProduct from "../components/AddProduct";
import { useProductContext } from "../context/productContext";
const NewInventory = () => {
  const { name } = useProductContext();
  return (
    <div className="font-poppins">
      <BreadCrum title={"NewInventory"} back={"/"} title2={"Add Product"} />

      <div className="mx-[12px] px-[30px]">
        <AddProduct />
      </div>

      <h3 className="text-[100px]">{name}</h3>
      <h3></h3>
    </div>
  );
};

export default NewInventory;
