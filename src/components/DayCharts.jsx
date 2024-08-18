import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getSalesForGraph, getCustomerForGraph } from "../helper/helper";
import PriceFormatter from "../helper/priceFormatter";

const DayChart = ({ select }) => {
  const [sales, setSales] = useState([]);
  const [customer, setCustomer] = useState([]);

  const fetchSalesData = async () => {
    const data = await getSalesForGraph();
    setSales(data.data);
  };

  const fetchCustomerData = async () => {
    const { data } = await getCustomerForGraph();
    setCustomer(data);
  };

  useEffect(() => {
    fetchSalesData();
    fetchCustomerData();
  }, []);

  const defaultData = [
    { _id: "Day 1", value: 10 },
    { _id: "Day 2", value: 10 },
    { _id: "Day 3", value: 10 },
    { _id: "Day 4", value: 10 },
    { _id: "Day 5", value: 10 },
    { _id: "Day 6", value: 10 },
    { _id: "Day 7", value: 10 },
  ];

  const renderChart = (dataKey, data) => (
    <ResponsiveContainer width="100%" height={350} className="py-[20px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip
          formatter={(value) =>
            select === "sales" ? <PriceFormatter price={value} /> : value
          }
        />
        <Legend />
        <Bar
          type="monotone"
          dataKey={dataKey}
          stroke="#2563eb"
          fill="#A3BFFA"
        />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="chart-container flex justify-center items-center">
      {select === "sales" &&
        renderChart("totalSales", sales?.length > 0 ? sales : defaultData)}
      {select === "order" &&
        renderChart("totalOrders", sales?.length > 0 ? sales : defaultData)}
      {select === "customers" &&
        renderChart(
          "totalCustomers",
          customer.length > 0 ? customer : defaultData
        )}
    </div>
  );
};

export default DayChart;
