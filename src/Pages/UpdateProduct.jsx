import { React, useContext } from "react";
import Navbar from "../components/Navbar";
import BreadCrum from "../components/BreadCrum";
import AddProduct from "../components/AddProduct";
import { useProductContext } from "../context/productContext";
import UpdateComponent from "../components/UpdateComponent";
const UpdateProduct = () => {
  const { name } = useProductContext();
  return (
    <div className="font-poppins">
      <Navbar title={"Update Product"} />
      <BreadCrum title={"Update Product"} back={"/"} title2={"Add Product"} />

      <div className="mx-[30px] px-[30px]">
        <UpdateComponent />
      </div>

      <h3 className="text-[100px]">{name}</h3>
      <h3></h3>
    </div>
  );
};

export default UpdateProduct;
