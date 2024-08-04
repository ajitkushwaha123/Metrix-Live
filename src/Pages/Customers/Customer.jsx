import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import BreadCrum from "../../components/BreadCrum";
import { LuUsers2 } from "react-icons/lu";
import { BsHandbag } from "react-icons/bs";
import Stats from "../../components/Stats";
import { BsFolder2Open } from "react-icons/bs";
import { TiPlus } from "react-icons/ti";
import CustomerTable from "../../DataTable/CustomerTable";
import { NavLink } from "react-router-dom";
import { getCustomerDetail } from "../../helper/helper";
import NewCustomer from "./AddCustomer";

const Customer = () => {
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalActiveCustomer, setTotalActiveCustomer] = useState(0);
  const [totalInactiveCustomer, setTotalInactiveCustomer] = useState(0);

  const fetchCustomersDetails = async () => {
    try {
      const res = await getCustomerDetail();
      console.log("aklscj", res);
      setTotalCustomer(res.data.customerDetails.totalCustomers);
      setTotalActiveCustomer(res.data.customerDetails.totalActive);
      setTotalInactiveCustomer(res.data.customerDetails.totalInactive);
      console.log("product Detail", totalInactiveCustomer);

      console.log("totalCustomer", totalCustomer);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomersDetails();
  }, []);

  return (
    <div>
      <BreadCrum title={"Customer"} back={"/"} />
      <div className="flex justify-between items-center px-[20px] md:px-[30px] py-[10px]">
        <h3 className="font-normal pt-[10px] text-[20px] font-poppins">
          Customer Summary
        </h3>
      </div>

      {/* Stats */}
      <div className="flex flex-col md:flex-row px-[28px] py-[10px]">
        <div className="w-[100%] md:w-[45%] mt-[4px]">
          <Stats
            bgColor="primary"
            height="170px"
            icon={<BsFolder2Open />}
            title1={"All"}
            title2={"Active"}
            title3={"In-Active"}
            stat1={totalCustomer}
            stat2={totalActiveCustomer}
            stat3={totalInactiveCustomer}
            // padY={"10px"}
            txtColor={"white"}
            present={"1"}
            dropdown={false}
          />
        </div>
        <div className="w-[100%] md:w-[55%] mt-[20px] md:mt-[0px] md:pl-[30px]">
          <Stats
            icon={<BsHandbag />}
            title1={"Low Stock Alert"}
            title2={"Expired"}
            txtColor={"text-red-200"}
            title3={"1 Start Rating"}
            stat1={"23"}
            stat2={"3"}
            stat3={"2"}
            present={"1"}
          />
        </div>
      </div>

      <div className="px-[20px] md:px-[30px] py-[30px]">
        <div className="bg-white md:py-[40px] pt-[20px] px-[20px] md:px-[40px]">
          <CustomerTable />
        </div>
      </div>
    </div>
  );
};

export default Customer;
