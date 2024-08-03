import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import DayChart from './DayCharts';
import ChartPie from './ChartPie';
import Chart from './Chart'
import { IoIosArrowDown } from "react-icons/io";
import {
  Dropdown,
  Link,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { getSalesForGraph } from '../helper/helper';

const Graph = ({title , present , present2 , height="327px"}) => {
  const [selected , setSelected] = useState('sales');
 

  const renderTimePeriod = () => {
    switch (selected) {
      case "sales":
        return "Sales";
      case "order":
        return "Orders";
      case "customers":
        return "Customers";
      default:
        return "";
    }
  };

  return (
    <div className={`rounded-xl font-poppins`}>
      <div className="flex justify-between items-center w-full px-[20px] md:px-7 py-4">
        <div className="">
          <p className="text-[18px] font-poppins text-medium mr-[15px]">
            Marketting
          </p>
        </div>
        <div>
          <button className="bg-secondary flex justify-center items-center md:px-[6px] py-[1px] rounded-xl mr-[20px]">
            <Dropdown backdrop="blur">
              <DropdownTrigger
                color="slate-400"
                classNames="text-[40px] text-txtPrimary"
              >
                <Button className="text-[16px]">
                  {renderTimePeriod()}
                  <MdOutlineKeyboardArrowDown />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="faded" aria-label="Static Actions">
                <DropdownItem
                  onClick={() => {
                    setSelected("sales");
                  }}
                  key="sales"
                >
                  Sales
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setSelected("order");
                  }}
                  key="order"
                >
                  Orders
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setSelected("customers");
                  }}
                  key="customers"
                >
                  Customers
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </button>
        </div>
      </div>

      {present2 && (
        <div className="flex px-7 justify-center items-center">
          <li className="mr-[10px]  text-center focus:list-disc text-primary">
            TakeAway
          </li>
          <li className="mr-[10px]  text-center text-[#97A5EB]">DineIn</li>
          <li className="mr-[10px]  text-center text-[#FFCC91]">
            HomeDelivery
          </li>
        </div>
      )}

      <div className="flex justify-center items-center">
        <div className='w-[100%]'>
          <DayChart select={selected} />
        </div>
      </div>
    </div>
  );
}

export default Graph
