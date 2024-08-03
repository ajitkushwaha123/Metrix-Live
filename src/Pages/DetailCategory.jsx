import React , {useEffect, useState} from 'react'
import { loader } from '../assets';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getSingleCategory } from '../helper/helper';

const DetailCategory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState({});
    let params = useParams();
    console.log(params.id);

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Required for FormData
      },
    };

    const getCategory = async (id) => {
      setIsLoading(true);
       try{
        const res = await getSingleCategory(id);
        console.log("resm" , res);
        setIsLoading(false);
        setCategory(res.data.category);
        console.log(category);
       }catch(err){
          console.log(err);
          setIsLoading(false);
       }
    }

    useEffect(() => {
      getCategory(params.id);
    } , [params.id]);

  return (
    <>{isLoading && <div><img src={loader}/></div>}
      {!isLoading && <div>
        <h1>Detail Category</h1>
        <h3>{category.name}</h3>
        <img src={category.photo} alt={category.name} />
      </div>}
    </>
  );
}

export default DetailCategory
