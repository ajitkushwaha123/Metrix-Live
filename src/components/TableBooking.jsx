import React, { useState } from "react";

const TableBooking = () => {
  const [rows, setRows] = useState([{ id: 1, title: "Row 1", tables: 1 }]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      { id: rows.length + 1, title: `Row ${rows.length + 1}`, tables: 1 },
    ]);
  };

  const handleDeleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleAddTable = (id) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, tables: row.tables + 1 } : row
      )
    );
  };

  const handleDeleteTable = (id) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, tables: Math.max(row.tables - 1, 1) } : row
      )
    );
  };


  const handleTitleChange = (id, value) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, title: value } : row))
    );
  };

  console.log(rows);

  return (
    <div className="w-full px-[50px] py-[50px]">
      <div className="flex justify-between">
        <button className="bg-primary text-white rounded-md px-[15px] py-2">
          + Table Reservation
        </button>
        <div className="flex justify-center items-center">
          <button
            onClick={handleAddRow}
            className="bg-primary ml-[20px] text-white rounded-md px-[15px] py-2"
          >
            + Add Row
          </button>
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
                  onChange={(e) => handleTitleChange(row.id, e.target.value)}
                  className="outline-none"
                />
              </h3>

              <div className="flex justify-center items-center">
                <button
                  onClick={() => handleAddTable(row.id)}
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
  );
};

export default TableBooking;
