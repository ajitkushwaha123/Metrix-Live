import React, { useState } from "react";
import { toast } from "react-hot-toast";  
import axios from "axios";
import {loader, metrix} from "../assets/index"
import { useNavigate } from "react-router-dom";
import { addCategory } from "../helper/helper";

const AddCategory = ({ onSubmit }) => {
  const [name , setName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl , setImageUrl] = useState(metrix);
  const [isLoading , setIsLoading] = useState(false);
  const [hasError , setHasError] = useState(false);
  const [errorMessage , setErrorMessage] = useState('');

  const fileHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  }

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    
    try{
      const res = await addCategory(name, selectedFile);
      setIsLoading(false);
      toast.success("Category Added Successfully");
      navigate("/category")
    }
    catch(err){
      setIsLoading(false);
      setHasError(true);
      setErrorMessage(err.response.data.message);
      toast.error("Failed to Add Category");
    }
  }
  
  return (
    <>
    {isLoading && <div>
      <img src={loader} />
    </div>}
    {!isLoading && <form onSubmit={submitHandler}>
      <label htmlFor="name">Category Name:</label>
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        id="name"
        name="name"
        // value={name}
        required
      />
      <input
        onChange={(e) => {fileHandler(e)}}
        type="file"
        id="photo"
        name="photo"
      />
      <button type="submit">Create Category</button>
      <img src={imageUrl} />
    </form>}
    {errorMessage && <div>{errorMessage}</div>}
    </>
  );
};

export default AddCategory;
