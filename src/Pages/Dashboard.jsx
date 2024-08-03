import React , { useState , useEffect } from 'react'
import Navbar from '../components/Navbar'
import BreadCrum from '../components/BreadCrum'
import Stats from '../components/Stats'
import { LuUsers2 } from "react-icons/lu";
import { BsHandbag } from "react-icons/bs";
import { AiOutlinePieChart } from "react-icons/ai";
import Graph from '../components/Graph';
import DayChart from '../components/DayCharts';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Chart from '../components/Chart';
import ChartPie from '../components/ChartPie';
import { BsFolder2Open } from 'react-icons/bs';
import { BsCart3 } from "react-icons/bs";
import RecentOrders from '../components/RecentOrders';
import { getProductDetail , getCustomerDetail } from '../helper/helper';

const Dashboard = () => {
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalActiveCustomer, setTotalActiveCustomer] = useState(0);
  const [totalInactiveCustomer, setTotalInactiveCustomer] = useState(0);


  const [totalProduct , setTotalProduct] = useState(0);
  const [totalPublished , setTotalPublished] = useState(0);

  const fetchProductsDetails = async () => {
    try {
      const res = await getProductDetail();  
      setTotalProduct(res.data.productDetail.total);
      setTotalPublished(res.data.productDetail.totalPublished);

      console.log("product Detail" , );
    } catch (error) {
      console.log(error);
    }
  }

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
    fetchProductsDetails();
    fetchCustomersDetails();
  } , []);

  return (
    <div className="w-full overflow-x-hidden">
      <Navbar title="Dashboard" />
      <BreadCrum />

      <div className="px-[20px] md:px-[40px] flex flex-col md:flex-row">
        <div className="w-[100%] mb-[20px] md:mb-[0px] md:w-[33.33%] md:pr-[15px]">
          <Stats
            sale={true}
            icon={<AiOutlinePieChart />}
            title1={"Sales"}
            title2={"Orders"}
            stat1={"$0.00"}
            stat1per={"0.00%"}
            stat2={"0"}
            // stat2per={"0.00%"}
            title3={"Cancelled"}
            stat3={"4"}
            // stat3per={"0.00%"}
            present={"1"}
          />
        </div>
        <div className="w-[100%] mb-[20px] md:mb-[0px] md:w-[33.33%] md:pl-[15px]">
          <Stats
            icon={<LuUsers2 />}
            title1={"Customers"}
            title2={"Active"}
            title3={"In-Active"}
            stat1={totalCustomer || "0"}
            // stat1per={"0.00%"}
            stat2={totalActiveCustomer || "0"}
            // stat2per={"0.00%"}
            stat3={totalInactiveCustomer || "0"}
            // stat3per={"0.00%"}
            present={"1"}
            dropdown={false}
          />
        </div>
        <div className="w-[100%] mb-[20px] md:mb-[0px] md:w-[33.33%] md:pl-[30px]">
          <Stats
            orderStatus={true}
            icon={<BsHandbag />}
            title1={"In Progress"}
            title2={"Pending"}
            title3={"Completed"}
            stat1={"$0.00"}
            // stat1per={"0.00%"}
            stat2={"$0.00"}
            // stat2per={"0.00%"}
            stat3={"$0.00"}
            // stat3per={"0.00%"}
            present={"1"}
          />
        </div>
      </div>

      <div className="flex md:py-[30px]">
        <div className="w-[100%] md:w-[62%]">
          <div className="px-[20px] md:px-[40px] flex md:flex-row flex-col">
            <div className="w-[100%] bg-white pb-[20px] h-[327px] rounded-xl ">
              <ChartPie />
            </div>

            <div className="w-[100%] md:ml-[28px]">
              <div className="mt-[20px] md:mt-[4px]">
                <Stats
                  bgColor="primary"
                  height="170px"
                  icon={<BsFolder2Open />}
                  title1={"All Products"}
                  title2={"Published"}
                  stat1={totalProduct}
                  stat2={totalPublished}
                  padY={"10"}
                  txtColor={"white"}
                  dropdown={false}
                />
              </div>

              <div className="mt-[20px] md:mt-[30px]">
                <Stats
                  height="159px"
                  icon={<BsCart3 />}
                  title1={"Abandoned Cart"}
                  title2={"Customers"}
                  stat1={"20%"}
                  stat2={"30"}
                  padY={"9"}
                />
              </div>
            </div>
          </div>

          <div className="px-[20px] md:px-[40px] flex py-[20px]">
            <div className="w-[100%] rounded-xl bg-white">
              <Graph title="1" height="400px" present={"1"} />
            </div>
          </div>
        </div>

        <div className="hidden md:block w-[100%] md:w-[35%]">
          <div className="bg-white rounded-xl  md:pr-[15px] w-full">
            <RecentOrders />
          </div>
        </div>
      </div>

      <div className=" md:hidden pb-[20px] px-[20px] w-[100%]">
        <div className="bg-white rounded-xl">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}

export default Dashboard
