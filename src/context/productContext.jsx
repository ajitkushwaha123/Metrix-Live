import React, { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import reducer from "../reducer/productReducer";

const AppContext = createContext();

const API = `${process.env.REACT_APP_API_URL}/api`;

const initialState = {
  isLoading: false,
  isError: false,
  products: [],
  isSingleLoading: false,
  singleProduct: {},
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const getProducts = async (url) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.get(url, config);
      console.log(res);
      const products = res.data;
      console.log("product : ", products);
      dispatch({ type: "MY_API_DATA", payload: products });
    } catch (error) {
      console.error("Error fetching products:", error);
      dispatch({ type: "API_ERROR" });
    }
  };

  const getSingleProduct = async (url) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    dispatch({ type: "SET_SINGLE_LOADING" });
    try {
      const res = await axios.get(`${API}${url}`, config);
      console.log("res", res);
      const singleProduct = res.data;
      console.log("singleproduct : ", singleProduct);
      dispatch({ type: "SET_SINGLE_PRODUCT", payload: singleProduct });
    } catch (error) {
      console.error("Error fetching single product:", error);
      dispatch({ type: "SET_SINGLE_ERROR" });
    }
  };

  useEffect(() => {
    getProducts(`${API}/products`);
  }, [API]);

  return (
    <AppContext.Provider value={{ ...state, getSingleProduct }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
const useProductContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useProductContext, AppContext };
