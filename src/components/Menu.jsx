import React, { useState , useEffect } from 'react'
import { CiSearch } from "react-icons/ci";
import { FaSearchengin } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { getCategory } from '../helper/helper';

const Menu = () => {
    const [category , setCategory] = useState([]);
    const fetchCategory = async () => {
        try {
            const res = await getCategory();
            console.log("Response from server:", res.data.categories);
            setCategory(res.data.categories);
            console.log("Category:", category); 
        } catch (error) {
            console.error("Error fetching category:", error);
        }
    }

    useEffect(() => {
        fetchCategory();
    })

  return (
    <div className="flex ml-[10px] h-screen my-[20px] text-[16px]">
      <div className="w-[20%] h-[90%] chalaja overflow-y-scroll">
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center">
          Categories
        </div>
        
        {category.map((item, index) => {
          return (
            <div
              key={index}
              className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white"
            >
              {item.name}
            </div>
          );
        })}

        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Beverages
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Burgers
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Pizza
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Pasta
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Desserts
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Salads
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Sandwiches
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Wraps
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Sides
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Specials
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Kids Menu
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Family Meals
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Drinks
        </div>
        <div className="h-[50px] border-b-2 border-slate-200 bg-secondary flex justify-center items-center bg-white">
          Desserts
        </div>
      </div>
      <div className="w-[54%]">
        <div className="flex justify-center items-center">
          <div className="w-[50%] h-[50px] flex rounded-md bg-white items-center ml-[10px]">
            <CiSearch className="text-[20px] mx-[10px]" />
            <input type="text" className="w-[90%] outline-none py-2" />
          </div>
          <div className="w-[50%] py-3 h-[50px] flex justify-center rounded-md bg-white items-center mx-[10px]">
            <FaSearchengin className="text-[15px] mx-[10px]" />
            <input type="text" className="w-[100%] outline-none py-2" />
          </div>
        </div>

        <div className="m-3 h-[80%] rounded-md">
          <div className="grid grid-cols-4 gap-4">
            <div className="h-[80px] flex justify-center items-center bg-white p-4 rounded-md text-start">
              Cold Sandwitch
            </div>
            <div className="h-[80px] flex justify-center items-center bg-white p-4 rounded-md text-start">
              Hot Sandwitch
            </div>
            <div className="h-[80px] flex justify-center items-center bg-white p-4 rounded-md text-start">
              Chicken Sandwitch
            </div>
            <div className="h-[80px] flex justify-center items-center bg-white p-4 rounded-md text-start">
              Beef Sandwitch
            </div>
            <div className="h-[80px] flex justify-center items-center bg-white p-4 rounded-md text-start">
              Vegetable Sandwitch
            </div>
            <div className="h-[80px] flex justify-center items-center bg-white p-4 rounded-md text-start">
              Club Sandwitch
            </div>
            <div className="h-[80px] flex justify-center items-center bg-white p-4 rounded-md text-start">
              Chicken Club Sandwitch
            </div>
            <div className="h-[80px] flex justify-center items-center bg-white p-4 rounded-md text-start">
              Beef Club Sandwitch
            </div>
            <div className="h-[80px] flex justify-center items-center bg-white p-4 rounded-md text-start">
              Vegetable Club Sandwitch
            </div>
          </div>
        </div>
      </div>

      <div className="w-[40%]">
        <div className="w-[100%] py-3 h-[50px] flex justify-center items-center">
          <button className="bg-primary w-[33%] mx-[5px] text-white px-[15px] py-3 rounded-md">
            Dine In
          </button>
          <button className="bg-primary w-[33%] mx-[5px] text-white px-[15px] py-3 rounded-md">
            Delivery
          </button>
          <button className="bg-primary w-[33%] mx-[5px] text-white px-[15px] py-3 rounded-md">
            Pickup
          </button>
        </div>

        <div className="bg-white text-start h-[82%] p-4 m-3 rounded-md">
          <div className="flex justify-between items-center">
            <div className="w-[50%]">
              <p>Product Name</p>
            </div>

            <div className="w-[30%]">Qunatity</div>
            <div className="w-[20%]">Amount</div>
          </div>

          <div className="flex border-2 border-slate-100 rounded-md my-[10px] px-[10px] justify-between items-center">
            <div className=" w-[50%]">
              <p>Chicken Sandwitch</p>
            </div>

            <div>
              <div className="flex  w-[30%] justify-center items-center">
                <button className="border-2 bg-slate-200 px-[8px] border-indigo-500/40 text-[17px] font-medium rounded-md">
                  +
                </button>
                <div className="p-3">1</div>
                <button className="border-2 bg-slate-200 px-[8px] border-indigo-500/40 text-[17px] font-medium rounded-md">
                  -
                </button>
              </div>
            </div>
            <div className=" w-[20%]">200</div>
          </div>

          <div className="flex border-2 border-slate-100 rounded-md my-[10px] px-[10px] justify-between items-center">
            <div className=" w-[50%]">
              <p>Chicken Sandwitch</p>
            </div>

            <div>
              <div className="flex  w-[30%] justify-center items-center">
                <button className="border-2 bg-slate-200 px-[8px] border-indigo-500/40 text-[17px] font-medium rounded-md">
                  +
                </button>
                <div className="p-3">1</div>
                <button className="border-2 bg-slate-200 px-[8px] border-indigo-500/40 text-[17px] font-medium rounded-md">
                  -
                </button>
              </div>
            </div>
            <div className=" w-[20%]">200</div>
          </div>

          <div className="flex border-2 border-slate-100 rounded-md my-[10px] px-[10px] justify-between items-center">
            <div className=" w-[50%]">
              <p>Chicken Sandwitch</p>
            </div>

            <div>
              <div className="flex  w-[30%] justify-center items-center">
                <button className="border-2 bg-slate-200 px-[8px] border-indigo-500/40 text-[17px] font-medium rounded-md">
                  +
                </button>
                <div className="p-3">1</div>
                <button className="border-2 bg-slate-200 px-[8px] border-indigo-500/40 text-[17px] font-medium rounded-md">
                  -
                </button>
              </div>
            </div>
            <div className=" w-[20%]">200</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu
