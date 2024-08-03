import React, { useEffect, useState } from "react";
import { AiOutlinePieChart } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import {loader} from '../assets'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import {
  Dropdown,
  Link,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { getSales } from "../helper/helper";
import SkeletonLoader from "./SkeletonLoader";

const Stats = ({
  title1,
  height = "145px",
  title2,
  icon,
  stat1,
  stat1per,
  stat2,
  stat2per,
  present = 0,
  title3,
  stat3,
  stat3per,
  padY = "5",
  bgColor = "white",
  txtColor,
  sale,
  orderStatus,
  dropdown="true",
}) => {
  const [selected, setSelected] = useState("today");
  const [sales, setSales] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchSales = async () => {
    setIsLoading(true);
    const res = await getSales();
    console.log("resooooo", res);
    setSales(res.data);
    setIsLoading(false);

    console.log("sales", sales);
  }

  useEffect(() => {
    fetchSales();
  }, [])

  const renderSales = () => {
    switch (selected) {
      case "today":
        return sale && <p>{sales.dailySales.totalSales || 0}</p>;
      case "yesterday":
        return sale && <p>{sales.yesterdaySales.totalSales || 0}</p>;
      case "weekly":
        return sale && <p>{sales.weeklySales.totalSales || 0}</p>;
      case "monthly":
        return sale && <p>{sales.monthlySales.totalSales || 0}</p>;
      case "yearly":
        return sale && <p>{sales.yearlySales.totalSales || 0}</p>;
      case "total":
        return sale && <p>{sales.totalSales.totalSales || 0}</p>;
      default:
        return null;
    }
  };

  const renderSalesPercentage = () => {
    switch (selected) {
      case "today":
        return sale &&
          isFinite(sales.yesterdayPrecentageImprovement) &&
          sales.yesterdayPrecentageImprovement < 0 ? (
          <p className="text-danger">
            {sales.yesterdayPrecentageImprovement} %
          </p>
        ) : sale && isFinite(sales.yesterdayPrecentageImprovement) ? (
          <p className="text-success">
            {sales.yesterdayPrecentageImprovement} %
          </p>
        ) : null;

      case "weekly":
        return sale &&
          isFinite(sales.weeklyPercentageImprovement) &&
          sales.weeklyPercentageImprovement < 0 ? (
          <p className="text-danger">{sales.weeklyPercentageImprovement} %</p>
        ) : sale && isFinite(sales.weeklyPercentageImprovement) ? (
          <p className="text-success">{sales.weeklyPercentageImprovement} %</p>
        ) : null;

      case "monthly":
        return sale &&
          isFinite(sales.monthlyPercentageImprovement) &&
          sales.monthlyPercentageImprovement < 0 ? (
          <p className="text-danger">{sales.monthlyPercentageImprovement} %</p>
        ) : sale && isFinite(sales.monthlyPercentageImprovement) ? (
          <p className="text-success">{sales.monthlyPercentageImprovement} %</p>
        ) : null;
      case "yearly":
        return sale &&
          isFinite(sales.yearlyPercentageImprovement) &&
          sales.yearlyPercentageImprovement < 0 ? (
          <p className="text-danger">{sales.yearlyPercentageImprovement} %</p>
        ) : sale && isFinite(sales.yearlyPercentageImprovement) ? (
          <p className="text-success">{sales.yearlyPercentageImprovement} %</p>
        ) : null;

      default:
        return null;
    }
  };

  const renderOrders = () => {
    switch (selected) {
      case "today":
        return sale && <p>{sales.dailySales.totalOrders || 0}</p>;
      case "yesterday":
        return sale && <p>{sales.yesterdaySales.totalOrders || 0}</p>;
      case "weekly":
        return sale && <p>{sales.weeklySales.totalOrders || 0}</p>;
      case "monthly":
        return sale && <p>{sales.monthlySales.totalOrders || 0}</p>;
      case "yearly":
        return sale && <p>{sales.yearlySales.totalOrders || 0}</p>;
      case "total":
        return sale && <p>{sales.totalSales.totalOrders || 0}</p>;
      default:
        return null;
    }
  };

  const pendingOrders = () => {
    switch (selected) {
      case "today":
        return orderStatus && <p>{sales.dailySales.totalPending || 0}</p>;
      case "yesterday":
        return orderStatus && <p>{sales.yesterdaySales.totalPending || 0}</p>;
      case "weekly":
        return orderStatus && <p>{sales.weeklySales.totalPending || 0}</p>;
      case "monthly":
        return orderStatus && <p>{sales.monthlySales.totalPending || 0}</p>;
      case "yearly":
        return orderStatus && <p>{sales.yearlySales.totalPending || 0}</p>;
      case "total":
        return orderStatus && <p>{sales.totalSales.totalPending || 0}</p>;
      default:
        return null;
    }
  };

  const completedOrders = () => {
    switch (selected) {
      case "today":
        return orderStatus && <p>{sales.dailySales.totalCompleted || 0}</p>;
      case "yesterday":
        return orderStatus && <p>{sales.yesterdaySales.totalCompleted || 0}</p>;
      case "weekly":
        return orderStatus && <p>{sales.weeklySales.totalCompleted || 0}</p>;
      case "monthly":
        return orderStatus && <p>{sales.monthlySales.totalCompleted || 0}</p>;
      case "yearly":
        return orderStatus && <p>{sales.yearlySales.totalCompleted || 0}</p>;
      case "total":
        return orderStatus && <p>{sales.totalSales.totalCompleted || 0}</p>;
      default:
        return null;
    }
  };

   const cancelledOrders = () => {
     switch (selected) {
       case "today":
         return sale && <p>{sales.dailySales.totalCancelled || 0}</p>;
       case "yesterday":
         return sale && <p>{sales.yesterdaySales.totalCancelled || 0}</p>;
       case "weekly":
         return sale && <p>{sales.weeklySales.totalCancelled || 0}</p>;
       case "monthly":
         return sale && <p>{sales.monthlySales.totalCancelled || 0}</p>;
       case "yearly":
         return sale && <p>{sales.yearlySales.totalCancelled || 0}</p>;
       case "total":
         return sale && <p>{sales.totalSales.totalCancelled || 0}</p>;
       default:
         return null;
     }
   };

  const inProgress = () => {
    switch (selected) {
      case "today":
        return orderStatus && <p>{sales.dailySales.totalProgress || 0}</p>;
      case "yesterday":
        return orderStatus && <p>{sales.yesterdaySales.totalProgress || 0}</p>;
      case "weekly":
        return orderStatus && <p>{sales.weeklySales.totalProgress || 0}</p>;
      case "monthly":
        return orderStatus && <p>{sales.monthlySales.totalProgress || 0}</p>;
      case "yearly":
        return orderStatus && <p>{sales.yearlySales.totalProgress || 0}</p>;
      case "total":
        return orderStatus && <p>{sales.totalSales.totalProgress || 0}</p>;
      default:
        return null;
    }
  };

  const renderTimePeriod = () => {
    switch (selected) {
      case "today":
        return "Today";
      case "yesterday" : 
        return "Yesterday";
      case "weekly":
        return "This Week";
      case "monthly":
        return "This Month";
      case "yearly":
        return "This Year";
      case "total":
        return "Total Sales";
      default:
        return "";
    }
  };

  return (
    <>
      {isLoading && 
      <Skeleton height={140}/>
      // <div></div>
      }
      {!isLoading && (
        <div
          className={`font-poppins h-${height} text-${txtColor} flex justify-center flex-col pb-[19px] bg-${bgColor} rounded-xl`}
        >
          <div>
            <div className={`flex justify-between py-5 px-5`}>
              <p className="bg-secondary text-[24px] text-primary p-2 rounded-lg">
                {icon}
              </p>
              <p
                className={`flex text-${txtColor} text-txtPrimary justify-center items-center`}
              >
                {dropdown && (
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
                          setSelected("today");
                        }}
                        key="today"
                      >
                        Today
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setSelected("yesterday");
                        }}
                        key="yesterday"
                      >
                        Yesterday
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setSelected("weekly");
                        }}
                        key="weekly"
                      >
                        This Week
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setSelected("monthly");
                        }}
                        key="monthly"
                      >
                        This Month
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setSelected("yearly");
                        }}
                        key="yearly"
                      >
                        This Year
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setSelected("total");
                        }}
                        key="total"
                      >
                        Total Sales
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </p>
            </div>

            <div className="flex px-5">
              <div className="w-[50%]">
                <p className={`text-txtPrimary text-start text-${txtColor}`}>
                  {title1}
                </p>
                <div className="flex">
                  {sale == true && renderSales()}
                  {orderStatus && inProgress()}
                  {!sale && !orderStatus && <p>{stat1}</p>}
                  <p
                    className={`flex text-txtGreen text-${txtColor} ml-[10px]`}
                  >
                    {sale && renderSalesPercentage()}
                    {/* {stat1per} */}
                  </p>
                </div>
              </div>
              <div className="w-[50%]">
                <p className={`text-txtPrimary text-start text-${txtColor}`}>
                  {title2}
                </p>
                <div className="flex">
                  {sale == true && renderOrders()}
                  {orderStatus == true && <p>{pendingOrders()}</p>}
                  {!sale && !orderStatus && <p>{stat2}</p>}
                  <p className={`text-txtGreen text-${txtColor} ml-[10px]`}>
                    {stat2per}
                  </p>
                </div>
              </div>

              {present == 1 && (
                <div className="w-[50%]">
                  <p className={`text-txtPrimary text-${txtColor} text-start`}>
                    {title3}
                  </p>
                  <div className="flex">
                    {sale == true && cancelledOrders()}
                    {orderStatus == true && sale != true && (
                      <p>{completedOrders()}</p>
                    )}
                    {!orderStatus && !sale && <p>{stat3}</p>}
                    <p className="text-txtGreen ml-[10px]">{stat3per}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
       )} 
    </>
  );
};

export default Stats;
