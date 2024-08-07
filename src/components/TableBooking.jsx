import React, { useEffect, useState } from "react";
import { getOrderTable, postOrderTable } from "../helper/helper";
import { Button } from "@nextui-org/react";
import { loader } from "../assets";

const TableBooking = () => {
  const [rows, setRows] = useState([{ id: 1, tables: 1, title: "Row 1" }]);
  const [loading , setLoading] = useState(false);
  const [isLoading , setIsLoading] = useState(false);

  const postTable = async (table) => {
    setLoading(true)
    console.log("Posting table data:", table);
    try {
      const res = await postOrderTable({ table });
      console.log("Response from server:", res);
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
    fetchTable();
  }, []);

  // useEffect(() => {
  //   postTable(rows);
  // }, [rows]);

  return (
    <div className="w-full px-[50px] py-[50px]">
      {isLoading && (
        <div>
          {" "}
          <img src={loader} />{" "}
        </div>
      )}
      {!isLoading && (
        <div>
          <div className="flex justify-between">
            <button
              onClick={handleAddRow}
              className="bg-primary text-white rounded-md px-[15px] py-2"
            >
              + Table Reservation
            </button>
            <div className="flex justify-center items-center">
              <button
                onClick={handleAddRow}
                className="bg-primary ml-[20px] text-white rounded-md px-[15px] py-2"
              >
                + Add Row
              </button>
              {!loading && (
                <button
                  onClick={handleSave}
                  className="bg-success ml-[20px] text-white rounded-md px-[15px] py-2"
                >
                  Save
                </button>
              )}
              {loading && (
                <Button color="primary" isLoading>
                  Loading
                </Button>
              )}
            </div>
          </div>

          {/* Table */}

          <div>
            {rows.map((row) => (
              <div
                key={row.id}
                className="py-[20px] border-2 shadow-lg bg-white rounded-md my-[20px] px-[30px]"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-primary py-[15px] text-start">
                    <input
                      type="text"
                      value={row.title}
                      onChange={(e) =>
                        handleTitleChange(row.id, e.target.value)
                      }
                      className="outline-none"
                    />
                  </h3>

                  <div className="flex justify-center items-center">
                    <button
                      onClick={(e) => handleAddTable(e, row.id)}
                      className="bg-primary text-white rounded-md px-[15px] py-1"
                    >
                      + Add Table
                    </button>
                    <button
                      onClick={() => handleDeleteTable(row.id)}
                      className="bg-danger mx-[20px] text-white rounded-md px-[15px] py-1"
                    >
                      Delete Table
                    </button>
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="bg-danger mx-[20px] text-white rounded-md px-[15px] py-1"
                    >
                      Delete Row
                    </button>
                  </div>
                </div>
                <div className="grid py-[30px] grid-cols-10 gap-4">
                  {Array.from({ length: row.tables }, (_, i) => (
                    <div
                      key={i}
                      className="bg-secondary mx-[10px] border-2 border-dashed border-slate-200 w-[80px] h-[80px] text-[20px] font-semibold flex justify-center items-center"
                    >
                      {i + 1}
                    </div>
                  ))}
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
