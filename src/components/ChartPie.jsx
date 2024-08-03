import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getSales } from "../helper/helper";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

// const COLORS = ["#5570F1", "#97A5EB", "#FFCC91"];
// const FADED_COLORS = ["#D3D3D3", "#D3D3D3", "#D3D3D3"]; // Faded colors for empty data

const ChartPie = () => {
  const [sales, setSales] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState("today");

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const res = await getSales();
      console.log("reowwow", res);
      setSales(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const takeAway = () => {
    switch (selected) {
      case "today":
        return sales.dailySales?.orderTypeTakeAway || 0;
      case "yesterday":
        return sales.yesterdaySales?.orderTypeTakeAway || 0;
      case "weekly":
        return sales.weeklySales?.orderTypeTakeAway || 0;
      case "monthly":
        return sales.monthlySales?.orderTypeTakeAway || 0;
      case "yearly":
        return sales.yearlySales?.orderTypeTakeAway || 0;
      case "total":
        return sales.totalSales?.orderTypeTakeAway || 0;
      default:
        return 0;
    }
  };

  const homeDelivery = () => {
    switch (selected) {
      case "today":
        return sales.dailySales?.orderTypeHomeDelivery || 0;
      case "yesterday":
        return sales.yesterdaySales?.orderTypeHomeDelivery || 0;
      case "weekly":
        return sales.weeklySales?.orderTypeHomeDelivery || 0;
      case "monthly":
        return sales.monthlySales?.orderTypeHomeDelivery || 0;
      case "yearly":
        return sales.yearlySales?.orderTypeHomeDelivery || 0;
      case "total":
        return sales.totalSales?.orderTypeHomeDelivery || 0;
      default:
        return 0;
    }
  };

  const dineIn = () => {
    switch (selected) {
      case "today":
        return sales.dailySales?.orderTypeDineIn || 0;
      case "yesterday":
        return sales.yesterdaySales?.orderTypeDineIn || 0;
      case "weekly":
        return sales.weeklySales?.orderTypeDineIn || 0;
      case "monthly":
        return sales.monthlySales?.orderTypeDineIn || 0;
      case "yearly":
        return sales.yearlySales?.orderTypeDineIn || 0;
      case "total":
        return sales.totalSales?.orderTypeDineIn || 0;
      default:
        return 0;
    }
  };

  const data =
    dineIn() === 0 && homeDelivery() === 0 && takeAway() === 0
      ? [{ name: "Dine-In", value: 99999999999 }]
      : [
          { name: "Dine-In", value: dineIn() },
          { name: "Home Delivery", value: homeDelivery() },
          { name: "Take Away", value: takeAway() },
        ];

  const COLORS = ["#97A5EB", "#5570F1", "#FFCC91"];
  const FADED_COLORS = ["#97A5EB", "#5570F1", "#FFCC91"];


  return (
    <div className="rounded-xl font-poppins">
      <div className="flex justify-between px-7 py-4">
        <div className="flex justify-center items-center">
          <p className="text-[18px] font-poppins text-medium mr-[15px]">
            Marketing
          </p>
          <button className="bg-secondary flex justify-center items-center px-[6px] py-[1px] rounded-xl">
            <Dropdown backdrop="blur">
              <DropdownTrigger
                color="slate-400"
                className="text-[40px] text-txtPrimary"
              >
                <Button className="text-[16px]">
                  {selected.charAt(0).toUpperCase() + selected.slice(1)}
                  <MdOutlineKeyboardArrowDown />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="faded" aria-label="Static Actions">
                <DropdownItem onClick={() => setSelected("today")} key="today">
                  Today
                </DropdownItem>
                <DropdownItem
                  onClick={() => setSelected("yesterday")}
                  key="yesterday"
                >
                  Yesterday
                </DropdownItem>
                <DropdownItem
                  onClick={() => setSelected("weekly")}
                  key="weekly"
                >
                  Weekly
                </DropdownItem>
                <DropdownItem
                  onClick={() => setSelected("monthly")}
                  key="monthly"
                >
                  Monthly
                </DropdownItem>
                <DropdownItem
                  onClick={() => setSelected("yearly")}
                  key="yearly"
                >
                  Yearly
                </DropdownItem>
                <DropdownItem onClick={() => setSelected("total")} key="total">
                  Total
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </button>
        </div>
      </div>

      <div className="flex px-7 justify-center items-center">
        <li className="mr-[12px] flex justify-center text-center focus:list-disc text-[#FFCC91]">
          TakeAway
        </li>
        <li className="mr-[12px] flex justify-center text-center text-[#97A5EB]">DineIn</li>
        <li className="mr-[12px] flex justify-center text-center text-primary">HomeDelivery</li>
      </div>

      {isLoading && (
        <div className="pt-[12px]">
          <Skeleton height={190} />
        </div>
      )}
      {!isLoading && (
        <div className="mx-auto flex justify-center items-center">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="25%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.value === 99999999999
                        ? FADED_COLORS[index % FADED_COLORS.length]
                        : COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ChartPie;