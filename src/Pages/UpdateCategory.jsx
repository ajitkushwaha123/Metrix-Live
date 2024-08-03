import React, { useState , useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { loader, metrix } from "../assets/index";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getCategoryById, updateCategory } from "../helper/helper";

const UpdateCategory = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(metrix);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [category, setCategory] = useState({});
  const [categoryName , setCategoryName] = useState("");

  let params = useParams();
  console.log(params.id);

  const fetchCategory = async () => {
    setIsLoading(true);
    try{
      const res = await getCategoryById(params.id);
       console.log("eksjla" ,  res.data);
        setIsLoading(false);
        setCategory(res.data.category);
        setImageUrl(res.data.category.photo);
        setCategoryName(res.data.category.name);
        console.log(category);
    }
    catch(err)
    {
      console.log(err);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCategory();
  }, [params.id]);

  const fileHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try{
      const response = await updateCategory( name , selectedFile , params.id);
      console.log("uPdated" , response);
      toast.success("Category Updated Success");
      setIsLoading(false);
      navigate("/category");
    }catch(err){
      setHasError(true);
      setErrorMessage(err.message);
      console.log(err);
      setIsLoading(false);
      toast.error("Error Updating Category");
    }
  };

  return (
    <>
      {isLoading && (
        <div>
          <img src={loader} />
        </div>
      )}
      {!isLoading && (
        <form onSubmit={submitHandler}>
          <label htmlFor="name">Category Name:</label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="name"
            name="name"
            // value={categoryName}
            required
          />
          {/* <label htmlFor="photo">Category Image (Optional):</label> */}
          <input
            onChange={(e) => {
              fileHandler(e);
            }}
            type="file"
            id="photo"
            name="photo"
          />
          <button type="submit">Create Category</button>
          <img src={imageUrl} />
        </form>
      )}
      {errorMessage && <div>{errorMessage}</div>}
    </>
  );
};

export default UpdateCategory;
