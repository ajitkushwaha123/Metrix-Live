import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {loader} from "../assets/index";
import { deleteCategory, getCategory } from "../helper/helper";

const Category = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/category/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/category/edit/${id}`);
  };

  const handleDelete = async ({ id, imageUrl }) => {
  setIsLoading(true);
  try{
    
      const res = await deleteCategory(id , imageUrl);
      console.log(res);
      setIsLoading(false);
      getData();
      navigate("/category");
  }
  catch(err){
    console.log(err);
      setIsLoading(false);
     } 
};

  const getData = async () => {
    try{
      const res = await getCategory();
      console.log("reso" , res);

      setCategoryList(res.data.categories);
    }catch(err)
    {
      console.log("Error Fetching Category");
    }
  };

  useEffect(() => {
    getData();
  }, []); 

  return (
    <>
      {isLoading && (
        <div>
          <img src={loader} />
        </div>
      )}
      {!isLoading && (
        <div>
          <h1>Category</h1>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {categoryList.map((category, index) => (
                <tr key={category._id}>
                  <td>{index + 1}</td>
                  <td>{category.name}</td>
                  <td>
                    <img src={categoryList[index].photo} alt={category.name} />
                  </td>
                  <button
                    onClick={() => {
                      handleEdit(category._id);
                    }}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete({ id: category._id, imageUrl: category.photo });
                    }}
                    type="button"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      handleView(category._id);
                    }}
                    type="button"
                  >
                    View
                  </button>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Category
