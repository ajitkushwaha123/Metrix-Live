import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import NewOrder from "../Pages/NewOrder";
import { getProd , searchProducts  } from "../helper/helper";

const ProductSearch = () => {
  const [quantities, setQuantities] = useState({});
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addItem = (event, productId) => {
    event.preventDefault();
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  };

  const deleteItem = (event, productId) => {
    event.preventDefault();
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      if (newQuantities[productId] > 0) {
        newQuantities[productId] -= 1;
      }
      return newQuantities;
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProd();
      console.log("resmmm" ,  response.data);
      setProducts(response.data);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
      fetchProducts();
  }, []);

  const AddedProduct = [];
  console.log(AddedProduct);

  const searchProducts = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await searchProducts(query);
    console.log("response", response);
    if (response.error) {
      setError(response.error);
    } else {
      setProducts(response.data);
    }

    setLoading(false);
  };

  return (
    <div className="overflow-y-scroll max-h-[500px]">
      <h1 className="text-primary text-start">Product Search</h1>
      <div className="flex bg-gray-50 pr-[20px] border outline-none text-sm rounded-lg dark:border-gray-500 dark:placeholder-gray-400 dark:text-white justify-center items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="p-2.5 outline-none w-full"
        />
        <CiSearch onClick={searchProducts} className="text-[24px]" />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div>
        {products.length > 0 &&
          products.map((product) => {
            if (quantities[product._id] > 0) {
              console.log(product.productName, quantities[product._id]);
              AddedProduct.push({ product , quantities });
              console.log("Product" , AddedProduct);
              return (
                <div key={product._id}>
                  {product.productName}: {quantities[product._id]}
                </div>
              );
            }
            return null;
          })}
      </div>

      <div>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id}>
              <div className="flex border-2 justify-between rounded-xl items-center py-[10px] px-[10px] my-[12px]">
                <div className="flex justify-between">
                  <img
                    className="w-[70px] h-[70px] rounded-md"
                    src={product.photos[0]}
                    alt={product.productName}
                  />
                  <div className="flex text-start mx-[14px] flex-col">
                    <h2 className="font-poppins font-medium">
                      {product.productName}
                    </h2>
                    <p>$ {product.price}</p>
                  </div>
                </div>

                {quantities[product._id] > 0 ? (
                  <div className="flex">
                    <button
                      onClick={(event) => addItem(event, product._id)}
                      className="border-2 bg-slate-200 px-[8px] border-indigo-500/40 text-[17px] font-medium rounded-md"
                    >
                      +
                    </button>
                    <div className="mx-[8px]">{quantities[product._id]}</div>
                    <button
                      onClick={(event) => deleteItem(event, product._id)}
                      className="border-2 bg-slate-200 px-[7px] border-indigo-500/40 text-[17px] font-medium rounded-md"
                    >
                      -
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(event) => addItem(event, product._id)}
                    className="text-primary cursor-pointer justify-center items-center"
                  >
                    <div>Add Item</div>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      <NewOrder AddedProduct={AddedProduct} />
    </div>
  );
};

export default ProductSearch;
