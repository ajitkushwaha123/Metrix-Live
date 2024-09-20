import React, { useState } from "react";
import LoadingButton from "../../components/LoadingButton";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { aiUpload } from "../../helper/helper";
import AiUpload from "./AiUpload";
const ItemTable = ({ data }) => {
  console.log("data", data);
  const navigate = useNavigate();

  const [itemData, setItemData] = useState(data);
  const [aiupload, setAiUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log("itemData", itemData);

  const handleNameChange = (index, newName) => {
    const updatedData = [...itemData];
    updatedData[index].Name = newName;
    setItemData(updatedData);
  };

  const handlePriceChange = (index, newPrice) => {
    const updatedData = [...itemData];
    updatedData[index].Price = newPrice;
    setItemData(updatedData);
  };

  const handleStockChange = (index, newStock) => {
    const updatedData = [...itemData];
    updatedData[index].Stock = newStock;
    setItemData(updatedData);
  };

  const handleCategoryChange = (index, newCategory) => {
    const updatedData = [...itemData];
    updatedData[index].Category = newCategory;
    setItemData(updatedData);
  };
  
  const handleShortCodeChange = (index, newShortCode) => {
    const updatedData = [...itemData];
    updatedData[index].ShortCode = newShortCode;
    setItemData(updatedData);
  };

  const handleVariant1Change = (index, newVariant1) => {
    const updatedData = [...itemData];
    updatedData[index].Variant1 = newVariant1;
    setItemData(updatedData);
  };

  const handleValue1Change = (index, newValue1) => {
    const updatedData = [...itemData];
    updatedData[index].Value1 = newValue1;
    setItemData(updatedData);
  };

  const handleVariant2Change = (index, newVariant2) => {
    const updatedData = [...itemData];
    updatedData[index].Variant2 = newVariant2;
    setItemData(updatedData);
  };

  const handleValue2Change = (index, newValue2) => {
    const updatedData = [...itemData];
    updatedData[index].Value2 = newValue2;
    setItemData(updatedData);
  };

  const handleVariant3Change = (index, newVariant3) => {
    const updatedData = [...itemData];
    updatedData[index].Variant3 = newVariant3;
    setItemData(updatedData);
  };

  const handleValue3Change = (index, newValue3) => {
    const updatedData = [...itemData];
    updatedData[index].Value3 = newValue3;
    setItemData(updatedData);
  };

  const handleUpload = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log("Item data:", itemData);

    try {
      const uploadPromise = aiUpload(itemData);

      toast.promise(uploadPromise, {
        loading: "Uplaoding Products ...",
        success: "Product Uplaoded Successfully... !",
        error: "Error uploading products , try again later !.",
      });

      await uploadPromise;

      uploadPromise
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log("Error:", err);
        });

      setLoading(false);
    } catch (err) {
      console.log("Error:", err);
      setLoading(false);
    }
  };

  const reUpload = (e) => {
    e.preventDefault();
    setAiUpload((prevState) => !prevState);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={true}></Toaster>
      {aiupload ? (
        <AiUpload />
      ) : (
        <div className="bg-white">
          <div className="relative w-full h-[90vh] chalaja overflow-y-scroll overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Item name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Short Code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Variant1
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Value1
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Variant2
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Value2
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Variant3
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Value3
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemData?.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <input
                        value={item.Name}
                        onChange={(e) =>
                          handleNameChange(index, e.target.value)
                        }
                        type="text"
                        className="outline-none border-bottom-2 border-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={item.Category}
                        onChange={(e) =>
                          handleCategoryChange(index, e.target.value)
                        }
                        type="text"
                        className="outline-none border-bottom-2 border-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={item.Price}
                        onChange={(e) =>
                          handlePriceChange(index, e.target.value)
                        }
                        type="number"
                        className="outline-none border-bottom-2 border-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={item.Stock}
                        onChange={(e) =>
                          handleStockChange(index, e.target.value)
                        }
                        type="number"
                        className="outline-none border-bottom-2 border-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={item.ShortCode}
                        onChange={(e) =>
                          handleShortCodeChange(index, e.target.value)
                        }
                        className="outline-none border-bottom-2 border-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={item.Variant1}
                        onChange={(e) =>
                          handleVariant1Change(index, e.target.value)
                        }
                        type="text"
                        className="outline-none border-bottom-2 border-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={item.Value1}
                        onChange={(e) =>
                          handleValue1Change(index, e.target.value)
                        }
                        type="number"
                        className="outline-none border-bottom-2 border-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={item.Variant2}
                        onChange={(e) =>
                          handleVariant2Change(index, e.target.value)
                        }
                        type="text"
                        className="outline-none border-bottom-2 border-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={item.Value2}
                        onChange={(e) =>
                          handleValue2Change(index, e.target.value)
                        }
                        type="number"
                        className="outline-none border-bottom-2 border-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={item.Variant3}
                        onChange={(e) =>
                          handleVariant3Change(index, e.target.value)
                        }
                        type="text"
                        className="outline-none border-bottom-2 border-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={item.Value3}
                        onChange={(e) =>
                          handleValue3Change(index, e.target.value)
                        }
                        type="number"
                        className="outline-none border-bottom-2 border-primary"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex px-[40px] py-[10px] md:px-[10px] justify-between items-center">
            <button
              onClick={(e) => {
                reUpload(e);
              }}
              className="bg-white border-2 border-primary px-[10px] py-[5px] font-medium rounded-md"
            >
              Reupload
            </button>

            {loading ? (
              <LoadingButton />
            ) : (
              <button
                onClick={(e) => handleUpload(e)}
                className="px-[15px] my-2 py-2 bg-primary text-white rounded-md"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ItemTable;
