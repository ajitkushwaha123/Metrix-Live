import React, { useEffect, useState } from "react";
import { getOrderTable, postOrderTable } from "../helper/helper";
import { Button } from "@nextui-org/react";
import { loader } from "../assets";
import { NavLink } from "react-router-dom";
import { getOrders } from "../helper/helper";
import { TbFileInvoice } from "react-icons/tb";
import toast , {Toaster} from 'react-hot-toast'
import Invoice from "./Invoice";
import LoadingButton from "../components/LoadingButton"
import PriceFormatter from "../helper/priceFormatter"

const TableBooking = () => {
  const [rows, setRows] = useState([{ id: 1, tables: 1, title: "Row 1" }]);
  const [loading , setLoading] = useState(false);
  const [isLoading , setIsLoading] = useState(false);
  const [bookedTable , setBookedTable] = useState([]);

  const fetchOrders = async () => {
    try{
      const res = await getOrders('/orders');
      console.log("resp " , res.data.orders);
      setBookedTable(res.data.orders)
    }catch(err){
      console.log(err)
    }
  }

  const postTable = async (table) => {
    setLoading(true)
    console.log("Posting table data:", table);
    try {
      const res = await postOrderTable({ table });
      console.log("Response from server:", res);
      toast.success("Table saved successfully");
      setLoading(false)
    } catch (error) {
      console.error("Error posting table data:", error);
      setLoading(false)
    }
  };

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: prevRows.length + 1,
        title: `Row ${prevRows.length + 1}`,
        tables: 1,
      },
    ])
  };

  const handleDeleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id))
  };

  const handleAddTable = (e, id) => {
    e.preventDefault();
    console.log("Adding table to row with id:", id);
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, tables: row.tables + 1 } : row
      )
    );
  };

  const handleDeleteTable = (id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, tables: Math.max(row.tables - 1, 1) } : row
      )
    );
  };

  const handleTitleChange = (id, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, title: value } : row))
    );
  };

  console.log(rows);

  const fetchTable = async () => {
    try {
      setIsLoading(true)
      const res = await getOrderTable();
      const data = res.orderTable.table;
      console.log("Fetched data:", data);

      setRows(
        data.map((item, index) => ({
          id: index + 1,
          title: item.title,
          tables: item.tables,
        }))
      );

      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching table data:", error);
      setIsLoading(false)
    }
  };

  const handleSave = () => {
    postTable(rows);
  };
  
  useEffect(() => {
    fetchOrders();
    fetchTable();
  }, []);
  
  return (
    <div className="w-full overflow-x-hidden md:px-[50px] p-[15px] md:py-[50px]">
      <Toaster position="top-center" reverseOrder="false"></Toaster>
      {isLoading && (
        <div>
          <img src={loader} />
        </div>
      )}
      {!isLoading && (
        <div>
          <div className="flex sm:justify-between">
            <button
              onClick={handleAddRow}
              className="bg-primary text-white rounded-md px-[10px] py-1 md:px-[15px] md:py-2"
            >
              Book
            </button>
            <div className="flex justify-center items-center">
              <button
                onClick={handleAddRow}
                className="bg-primary ml-[20px] text-white rounded-md md:px-[15px] px-[10px] py-1 md:py-2"
              >
                + Add Row
              </button>
              {!loading && (
                <button
                  onClick={handleSave}
                  className="bg-success ml-[20px] text-white rounded-md px-[10px] md:px-[15px] py-1 md:py-2"
                >
                  Save
                </button>
              )}
              {loading && (
                <LoadingButton />
              )}
            </div>
          </div>

          {/* Table */}

          <div>
            {rows.map((row) => (
              <div
                key={row.id}
                className="py-[15px] border-2 shadow-lg bg-white rounded-md my-[20px] px-[10px] sm:px-[30px]"
              >
                <div className="sm:flex sm:justify-between items-center">
                  <h3 className="text-primary py-[15px] sm:py-[15px] text-start">
                    <input
                      type="text"
                      value={row.title}
                      onChange={(e) =>
                        handleTitleChange(row.id, e.target.value)
                      }
                      className="outline-none"
                    />
                  </h3>

                  <div className="flex sm:mx-[0px] justify-center items-center">
                    <button
                      onClick={(e) => handleAddTable(e, row.id)}
                      className="bg-primary flex justify-center items-center text-white rounded-md px-[5px] sm:px-[15px] py-1"
                    >
                      + Add Table
                    </button>
                    <button
                      onClick={() => handleDeleteTable(row.id)}
                      className="bg-danger mx-[10px] sm:mx-[20px] text-white rounded-md px-[5px] md:px-[15px] py-1"
                    >
                      Delete Table
                    </button>
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="bg-danger  sm:mx-[20px] text-white rounded-md px-[15px] py-1"
                    >
                      Delete Row
                    </button>
                  </div>
                </div>
                <div className="grid px-[10px] py-[20px] md:py-[30px] grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-4">
                  {Array.from({ length: row.tables }, (_, i) => {

                    let orderId ;
                    const bookedItem = bookedTable.find(
                      (item) =>
                        item.tableId === `${row.id}${i}` &&
                        item.orderStatus !== "completed" &&
                        item.orderStatus !== "cancelled"
                    );


                    console.log("bookedItem" , bookedItem);

                    return (
                      <NavLink key={i} to={`/menu/${row.id}${i}`}>
                        {bookedItem ? (
                          <NavLink to={`/order-view/${bookedItem._id}`}>
                            <div
                              className={`relative flex flex-col bg-secondary relative border-2 border-dashed border-slate-200 w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] text-[20px] font-semibold flex justify-center items-center`}
                            >
                              <button className="bg-success text-[14px] text-white px-[10px] py-1 rounded-xl">
                                <PriceFormatter price={bookedItem.price} />
                              </button>
                              <div className="text-white mb-[-20px] w-[30px] h-[30px] rounded-full bg-primary flex justify-center items-center">
                                <Invoice
                                  btnText=""
                                  orderId={bookedItem._id}
                                  className="text-white mt-[6px] flex justify-center items-center bg-primary px-[10px]"
                                />
                              </div>
                            </div>
                          </NavLink>
                        ) : (
                          <div
                            className={` bg-secondary border-2 border-dashed border-slate-200 w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] text-[20px] font-semibold flex justify-center items-center`}
                          >
                            {i + 1}
                          </div>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableBooking;
