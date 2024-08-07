// Api request
import { user } from "@nextui-org/react";
import axios from "axios";
axios.defaults.baseURL = "https://metrix-backend.onrender.com";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://metrix-backend.onrender.com/api";
// Authentication function
export async function authenticate(username) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    return { error: "Username doesn't exist... !" };
  }
}

export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found"); // Throw an error with a descriptive message
  }
  const decoded = jwtDecode(token);
  console.log("decoded" , decoded);
  return decoded;
}

export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (error) {
    return { error: "Password doesn't Match... !" };
  }
}

export async function getOrders(url) {
  const { userId } = await getUsername();
  console.log("User ID:", userId);
  const token = localStorage.getItem("token");
  console.log("Token:", token);
  if (!token) {
    throw new Error("Token not found"); // Throw an error with a descriptive message
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", 
    },
  };

  try {
    const { data } = await axios.get(
      `${API_URL}/${url}`,
      config
    );
    console.log("Orders:", data);
    return  {data};

  } catch (error) {
    return { error: "Couldn't fetch Orders" };
  }
}

export async function getCustomers(url) {
  const { userId } = await getUsername();
  console.log("User ID:", userId);
  const token = localStorage.getItem("token");
  console.log("Token:", token);
  if (!token) {
    throw new Error("Token not found"); // Throw an error with a descriptive message
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    console.log("URL:", url);
    const { data } = await axios.get(`${API_URL}/${url}`, config);
    console.log("CutiePie:", data);
    return data;
  } catch (error) {
    return { error: "Couldn't fetch Orders" };
  }
}

export async function getSingleOrders(url) {
  const token = localStorage.getItem("token");
  console.log("Token:", token);
  if (!token) {
    throw new Error("Token not found"); // Throw an error with a descriptive message
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    console.log("URL:", url);
    const { data } = await axios.get(`${API_URL}/${url}`, config);
    console.log("Orders:", data);
    return data;
  } catch (error) {
    return { error: "Couldn't fetch Orders" };
  }
}

export async function registerUser(credential) {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`/api/register`, credential);

    let { username, email } = credential;

    if (status === 201) {
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text: msg,
      });
    }

    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function verifyPassword({ username, password }) {
  console.log({ username, password });
  try {
    const data = await axios.post("/api/login", { username, password });
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Password doesn't Match... !" });
  }
}

export async function addProduct(values) {
  try {
    const token = localStorage.getItem("token");
    console.log(values);

    const formData = new FormData();
    formData.append("productName", values.productName); // Ensure productName is a single value
    formData.append("discountPrice", values.discountPrice);
    formData.append("orderType", values.orderType);
    formData.append("longDescription", values.longDescription);
    formData.append("variant", values.variant);
    formData.append("shortDescription", values.shortDescription);
    formData.append("category", values.category);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("status" , values.status);
    formData.append("photos", values.photos[0]); // Ensure photos is a single value
    if(values.photos[1]) formData.append("photos", values.photos[1]); 
    if (values.photos[2]) formData.append("photos", values.photos[2]); 
    if (values.photos[3]) formData.append("photos", values.photos[3]); 
    console.log("Form Data:", values.photos);

    console.log("Selected photos:", values.photos);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Required for FormData
      },
    };

    const { data } = await axios.post("/api/products", formData, config);

    console.log("Product added successfully:", data);

    return Promise.resolve({ product: data });
  } catch (error) {
    console.error("Error adding product:", error);
    return Promise.reject({ error: error.message });
  }
}

export async function updateProduct(values) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const formData = new FormData();
    formData.append("productName", values.productName);
    // formData.append("discountPrice", values.discountPrice);
    formData.append("orderType", values.orderType);
    // formData.append("longDescription", values.longDescription);
    // formData.append("variant", values.variant);
    // formData.append("shortDescription", values.shortDescription);
    formData.append("category", values.category);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("status", values.status);

    if (values.photos && values.photos.length > 0) {
      values.photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo);
      });
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.put(
      `/api/products/${values._id}`,
      formData,
      config
    );

    console.log("Product updated successfully:", data);

    return { product: data };
  } catch (error) {
    console.error("Error updating product:", error);
    return { error: error.message };
  }
}


export async function handleCustomers(values , id)  {
  console.log("csnxv" , id);
  const token = localStorage.getItem("token");
  console.log(token);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  console.log("skfhlk", values);

  try {
    const { data } = await axios.put(
      `${API_URL}/customer/${id}`,
      values,
      config
    );

    console.log("Customer Added", data);
    return Promise.resolve({ data });
  } catch (err) {
    console.error("Error adding customer :", err.message);
    return Promise.reject({ err });
  }
};


export async function addCustomers(values){
  const token = localStorage.getItem("token");
  console.log(token);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.post(
      `${API_URL}/customer`,
      values,
      config
    );

    console.log("Customer Added", data);
    return Promise.resolve({ customer: data });
  } catch (err) {
    console.error("Error adding customer :", err.message);
    return Promise.reject({ err: err.message });
  }
};



export async function updateUser(response) {
  try {
    const token = localStorage.getItem("token");
    console.log(token);

    const { data } = await axios.put("/api/updateUser", response, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't update profile." });
  }
}

export async function getSingleCustomer(id){
  try {
       const token = localStorage.getItem("token");
       if (!token) {
         console.log("Token not found");
         return;
       }

       const config = {
         headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
         },
       };

       console.log("idm sm" , id);

       const {data} = await axios.get(
         `${API_URL}/customer/find/${id}`,
         config
       );

       console.log("diita" , data);
       return Promise.resolve({ data });
      
     } catch (err) {
       return Promise.reject({ error: "Error Fetching Customer..." });
     }
}

export async function getAllCustomers(){
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token not found");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };


    const response = await axios.get(
      `${API_URL}/customer`,
      config
    );

    console.log("Customer", response.data);
    return Promise.resolve( response.data );
  } catch (err) {
    return Promise.reject({ error: "Error Fetching Customer..." });
  };
}

export async function getOrderByCustomer(id) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token not found");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    console.log("idm sm", id);

    const { data } = await axios.get(
      `${API_URL}/orders/customer/${id}`,
      config
    );

    console.log("diita", `${API_URL}/orders/customer/${id}`);
    console.log("diita", data);
    return Promise.resolve({ data });
  } catch (err) {
    return Promise.reject({ error: "Error Fetching Customer..." });
  }
}

export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("/api/generateOTP", { params: { username } });
    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });
      let text = `Your Password Recovery OTP IS ${code}, verify and recover your password`;
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text,
        subject: "Password Recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put("/api/resetPassword", {
      username,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}


export async function getSales(){
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const res = await axios.get(`${API_URL}/orders/sales`, config);

    const sales = res;
    console.log("sales:", sales);
    return sales;
  }
  catch (error) {
    console.error("Error fetching daily sales:", error);
    return { error: "Couldn't fetch sales" };
  }
};

export async function getSalesForGraph(){
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const res = await axios.get(`${API_URL}/orders/sales-graph`, config);

    const sales = res;
    console.log("sales-graph:", sales);
    return sales;
  }
  catch (error) {
    console.error("Error fetching daily sales:", error);
    return { error: "Couldn't fetch sales" };
  }
};

export async function getCustomerForGraph(){
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const res = await axios.get(`${API_URL}/customer/customer-graph`, config);

    const customer = res;
    console.log("customer-graph:", customer);
    return customer;
  }
  catch (error) {
    console.error("Error fetching daily customer:", error);
    return { error: "Couldn't fetch customer" };
  }
};

export async function getProductDetail(){
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const res = await axios.get(`${API_URL}/products/size`, config);

    const product = res;
    console.log("product-detail:", product);
    return product;
  }
  catch (error) {
    console.error("Error fetching product detail:", error);
    return { error: "Couldn't fetch product detail" };
  }
}

export async function getProducts(ProductAPI) {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const {data} = await axios.get(`${ProductAPI}`, config);

    const product = {data};
    console.log("product-detail:", product);
    return product;
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return { error: "Couldn't fetch product detail" };
  }
}

export async function getCustomerDetail() {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const res = await axios.get(`${API_URL}/customer/customer-detail`, config);

    const customer = res;
    console.log("customer-detail:", customer);
    return customer;
  } catch (error) {
    console.error("Error fetching customer detail:", error);
    return { error: "Couldn't fetch customer detail" };
  }
}

export async function updateOrder(orderAPI, values) {
  console.log("values:", values);

  const token = localStorage.getItem("token");
  console.log("Token:", token);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  console.log("Order API:", orderAPI);

  try {
    const res = await axios.put(`${API_URL}/${orderAPI}`, values, config);
    console.log("Updated order:", res.data);
    return res.data; // Return the response data directly
  } catch (error) {
    console.error(
      "Error updating order:",
      error.response ? error.response.data : error.message
    );
    return { error: "Couldn't update order" };
  }
}


export async function bulkUploader(file){
  try{
    const token = localStorage.getItem("token");
    console.log(token);


    console.log("file" , file);
    const formData = new FormData();
    formData.append("file", file);

    console.log("Form Data:", formData);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const  response  = await axios.post(
      `${API_URL}/bulkupload/upload`,
      formData,
      config
    );
    console.log("Bulk Upload:", response);

    return Promise.resolve({ response });
  }catch(err)
  {
    console.log("Error submitting form:", err);
    return Promise.reject({ error: "Couldn't upload file" });
  }
}

export async function deleteAPI(id)
{
  try{
    const token = localStorage.getItem("token");
    console.log(token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.delete(
      `${API_URL}/orders/${id}`,
      config
    );

    console.log("Item Deleted :", response);

    return Promise.resolve({ response });
  }catch(err){
    console.log("Error deleting file:", err);
    return Promise.reject({ error: "Couldn't delete file" });
  }
}

export async function getAllProducts() {
  try {
    const token = localStorage.getItem("token");
    console.log(token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const {data} = await axios.get(`${API_URL}/products`, config);
    console.log("All Products:", data);
    // return data.data; 
    return Promise.resolve({ data });
  } catch (err) {
    console.log("Error fetching products:", err);
    // throw new Error("Couldn't fetch products"); 
    return Promise.reject({ error: "Couldn't fetch products" });
  }
}

export async function searchProduct(query){
  try{
    const token = localStorage.getItem("token");
    console.log(token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const {data} = await axios.get(`${API_URL}/products?search=${query}`, config);
    console.log("Search Products:", data);
    return Promise.resolve({ data });
  }catch(err)
  {
    console.log("Error fetching products:", err);
    return Promise.reject({ error: "Couldn't find products" });
  }
}

export async function insertOrders(values){
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.post(
      `${API_URL}/orders`,
      values,
      config
    );

    console.log("Orders Added", data);
    return Promise.resolve({ data });
  }catch(err)
  {
    console.error("Error adding orders:", err);
    return Promise.reject({ error: "Couldn't add orders" });
  }
}

export async function getCategory(){
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

  };

  try{
    const {data} = await axios.get(`${API_URL}/category`, config);
    console.log("Category:", data);
    return Promise.resolve({ data });
  }
  catch(err){
    console.error("Error fetching category:", err);
    return Promise.reject({ error: "Couldn't fetch category" });
  }
}


export async function getProd() {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.get(`${API_URL}/products`, config);

    const product = { data };
    console.log("product-detail:", product);
    return product;
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return { error: "Couldn't fetch product detail" };
  }
}

export async function searchProducts(query){
  try{
    const token = localStorage.getItem("token");
    console.log(token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const {data} = await axios.get(`${API_URL}/products?search=${query}`, config);
    console.log("Search Products:", data);
    return { data };
  }catch(err)
  {
    console.log("Error fetching products:", err);
    return { error: "Couldn't find products" };
  }
}

export async function deleteProducts(id){
  try{
    const token = localStorage.getItem("token");
    console.log(token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.delete(
      `${API_URL}/products/${id}`,
      config
    );

    console.log("Item Deleted :", response);

    return { response };
  }catch(err){
    console.log("Error deleting file:", err);
    return { error: "Couldn't delete file" };
  }
}

export async function deleteCustomers(id) {
  try {
    const token = localStorage.getItem("token");
    console.log(token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.delete(`${API_URL}/customer/${id}`, config);

    console.log("Item Deleted :", response);

    return { response };
  } catch (err) {
    console.log("Error deleting file:", err);
    return { error: "Couldn't delete file" };
  }
}

export async function addCategory(name , selectedFile)
{
  const formData = new FormData();
    formData.append("name", name);
    formData.append("photo", selectedFile);

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Required for FormData
      },
    };

    console.log(selectedFile);

    console.log("Form Data:", formData);
    try{
      const { data } = await axios.post( `${API_URL}/category`, formData , config);
      console.log(data);
      return Promise.resolve( data );
    }
    catch(err){
      console.log(err);
      return Promise.reject({ err });
    }

}


export async function getCategoryById(id){
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Required for FormData
    },
  };

  try{
    const response = axios.get(
    `${API_URL}/category/${id}`,
    config
  );

     return Promise.resolve( response );
  }
  catch(err){
    return Promise.reject( err );
  }
}

export async function updateCategory(name , selectedFile , id)
{
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Required for FormData
    },
  };



  const formData = new FormData();
  formData.append("name", name);
  formData.append("photo", selectedFile);

  console.log("Form Data:", formData);
  
  try{
    const response =  axios.put(`${API_URL}/category/` + id, formData, config);
    console.log("ressss" , response)
    return Promise.resolve(response);
  }
  catch(err){
    return Promise.reject(err);
  }
  
}

export async function getSingleCategory(id){
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try{

    const response = axios.get(
      `${API_URL}/category/${id}`,
      config
    );

    console.log("resp" , response);
    return Promise.resolve(response);
  }catch(err)
  {
    console.log("Error Fetching Categroy");
    return Promise.reject(err);
  }
}

export async function deleteCategory(id , imageUrl){
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try{

    const res = axios.delete(
       `${API_URL}/category/?id=${id}&imageUrl${imageUrl}`,
       config
     );

     return Promise.resolve(res);

  }catch(err)
  {
    console.log("Error deleting Category");
    return Promise.reject(err);
  }
}

export async function getOrderTable(){
   const token = localStorage.getItem("token");
   const config = {
     headers: {
       Authorization: `Bearer ${token}`,
     },
   };

   try{
      const {data} = await axios.get(
        `http://localhost:8000/api/orderTable`,
        config
      );

      console.log("responsee" , data);
      return Promise.resolve(data)
   }
   catch(err){
    console.log("Error Fetching Table Details");
    return Promise.reject(err);
   }
} 

export async function postOrderTable(values) {
  const token = localStorage.getItem("token");

  console.log("Values:", values);
  console.log("Token:", token);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.put(
      `http://localhost:8000/api/orderTable`,
      values,
      config
    );
    console.log("Response:", res);

    return Promise.resolve(res);
  } catch (err) {
    console.log("Error Creating Tables:", err);
    return Promise.reject(err);
  }
}

