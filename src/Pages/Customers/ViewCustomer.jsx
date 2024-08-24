import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleCustomer } from "../../helper/helper";
import BreadCrum from "../../components/BreadCrum";
import { CiUser } from "react-icons/ci";
import { MdOutlinePayment } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import ViewCustomerTable from "../../DataTable/ViewCustomerTable";
import { format } from "date-fns"; 

const ViewCustomer = () => {
  const { id } = useParams();
  console.log("id", id);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [orderPrice, setOrderPrice] = useState(0);
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("id", id);
        const { data } = await getSingleCustomer(id);
        console.log("data", data);
        setCustomerName(data.customerName);
        setPhone(data.phone);
        setStatus(data.status);
        setOrderPrice(data.OrderPrice);
        setCreatedAt(format(new Date(data.createdAt), "PPpp")); // Format the date
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div>
      <BreadCrum title={"Inventory"} back={"/"} />

      <div className="px-[20px] md:px-[40px]">
        <div className="flex justify-between items-center">
          <div className="flex">
            <p className="mr-[30px] font-medium">
              Order Number :<span className="text-slate-500 ml-[10px]">#</span>
            </p>
            <p className="mr-[30px] text-[18px] text-slate-500">
              <span className="font-medium text-black text-[18px]">
                Dated : {createdAt}
              </span>
            </p>
          </div>
        </div>

        <div className="py-[30px]">
          <div className="flex flex-col md:flex-row">
            <div className="mx-[10px] sm:w-[50%] md:w-[33%] bg-[white] pb-[15px] rounded-xl  md:w-[33%]">
              <div className="flex justify-between p-5">
                <div className="flex justify-center items-center">
                  <p className="bg-secondary mr-[15px] text-[24px] text-primary p-2 rounded-lg">
                    <CiUser />
                  </p>
                  <div className="text-start text-slate-500">
                    <h2 className="text-black">{customerName}</h2>
                    <h3>
                      Customer since :
                      <span className="font-medium text-black"> 12/07/23</span>
                    </h3>
                  </div>
                </div>

                <div className="">
                  <h2 className="bg-secondary text-primary rounded-md p-1">
                    {status}
                  </h2>
                </div>
              </div>

              <div className="flex">
                <div className="flex text-start w-[100%] px-[18px]">
                  <div className="w-[50%]">
                    <h2 className="text-slate-400">
                      Phone : <br />{" "}
                      <span className="text-black"> {phone} </span>
                    </h2>
                  </div>

                  <div className="w-[50%]">
                    <h2 className="text-slate-400">
                      Total amount :
                      <br />
                      <span className="text-black"> {orderPrice} </span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="mx-[10px] my-[25px] md:my-[0px] bg-[white] pb-[15px] rounded-xl  md:w-[33%]">
              <div className="flex justify-between p-5">
                <div className="flex justify-center items-center">
                  <p className="bg-secondary mr-[15px] text-[24px] text-primary p-2 rounded-lg">
                    <CiLocationOn />
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex w-[100%] text-start px-[18px]">
                  <div className="w-[50%]">
                    <h2 className="text-slate-400">
                      Quantity : <br />
                      <span className="text-black text-medium text-[17px] px-[3px]">
                        
                      </span>
                    </h2>
                  </div>
                  <div className="w-[50%]">
                    <h2 className="text-slate-400">
                      New Customer :
                      <br />
                      <span className="text-black text-[17px] px-[3px]">
                        True
                      </span>
                    </h2>
                  </div>
                </div>
              </div>
            </div> */}

            {/* <div className="mx-[10px] bg-[white] pb-[15px] rounded-xl  md:w-[33%]">
              <div className="flex justify-between p-5">
                <div className="flex justify-center items-center">
                  <p className="bg-secondary mr-[15px] text-[24px] text-primary p-2 rounded-lg">
                    <MdOutlinePayment />
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex w-[100%] text-start px-[18px]">
                  <div className="w-[50%]">
                    <h2 className="text-slate-400">
                      Payment Method : <br />
                      <span className="text-black"> Unavailable </span>
                    </h2>
                  </div>
                  <div className="w-[50%]">
                    <h2 className="text-slate-400">
                      Order Type :
                      <br />
                      <span className="text-black"> Unavailable </span>
                    </h2>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="bg-white px-4 pt-8 md:p-12">
          <ViewCustomerTable />
        </div>
      </div>
    </div>
  );
};

export default ViewCustomer;
