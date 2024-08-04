import React, { useEffect, useState } from "react";
import { LuShirt } from "react-icons/lu";
import { upload, upload2, upload3, upload4 } from "../assets";
import { useFormik } from "formik";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { addProduct } from "../helper/helper";
// import { image } from "@nextui-org/react";
import { Textarea, Input } from "@nextui-org/react";
import { loader } from "../assets";
import { useNavigate } from "react-router-dom";
import toast , { Toaster } from 'react-hot-toast';
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { getCategory } from "../helper/helper";

const AddProduct = () => {
  const [photos, setPhotos] = useState([]);
  const [imageUrl, setImageUrl] = useState(upload); 
  const [loading ,setLoader] = useState(false);
  const [draft , setDraft] = useState(false);
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
 
  console.log("Category data", selectCategory);

  const fetchCategory = async () => {
      const response = await getCategory();
      console.log("Category data", response);
      setCategory(response.data.categories);
      console.log("Category ed successfully", response.data.categories);

      console.log("Category data fetched successfully", category);
  };

  useEffect(() => {
    fetchCategory();
  }, []);


  const navigate = useNavigate();

  const fileHandler = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prevPhotos) => {
      const updatedPhotos = [...prevPhotos, ...files];
      console.log("photos", updatedPhotos); 
      formik.setFieldValue("photos", updatedPhotos); // Set the updated photos array
      return updatedPhotos;
    });

    if (files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        setImageUrl(event.target.result);
      };
      fileReader.readAsDataURL(files[0]); // Read the first file to set the image URL
    }
  };

  const deletePhoto = (index) => {
    setPhotos((prevPhotos) => {
      const updatedPhotos = prevPhotos.filter((_, i) => i !== index);
      formik.setFieldValue("photos", updatedPhotos);
      return updatedPhotos;
    });
  };

  const formik = useFormik({
    initialValues: {
      productName: "",
      category: "",
      price: "",
      discountPrice: "",
      stock: "",
      photos: [],
      status : "published",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values.category = selectCategory;
      if(draft  === true){
        values.status = "draft";
      }
      else{
        values.status = "published";
      }
      console.log("values", values);
      let addProductPromise = addProduct(values);
      console.log("addProductPromise", addProductPromise);
      toast.promise(addProductPromise, {
        loading: "Creating...",
        success: <b>Product Added Successfully... !</b>,
        error: <b>Error Creating Product... !</b>,
      });

      addProductPromise.then(() => {
        formik.resetForm();
      });
    },
  });

  const handleDraft = (e) => {
    e.preventDefault();
    setDraft(true);
    formik.handleSubmit();
  }

  const handlePublished = (e) => {
    e.preventDefault();
    setDraft(false);
    formik.handleSubmit();
  }
  
  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder="false"></Toaster>
        {loading && (
          <div>
            <img src={loader} />
          </div>
        )}
        {!loading && (
          <div className="">
            <div className="flex md:px-[40px] py-[20px] justify-between items-center">
              <p className="text-[22px] font-medium">Add New Product</p>
            </div>
            <form className="flex flex-col justify-center rounded-xl w-[full] items-center">
              <div className="px-[20px] md:px-[40px] md:flex-row flex-col mb-[30px] rounded-xl bg-white py-[20px] justify-center items-center flex ">
                <div className="font-poppins flex justify-center items-center flex-col md:mr-[30px] bg-white">
                  <div className="flex md:hidden justify-center items-center flex-col">
                    <div>
                      <div>
                        <img
                          className="rounded-xl p-2 w-[220px] h-[220px] cursor-pointer"
                          src={imageUrl}
                          onClick={() =>
                            document.getElementById("photos").click()
                          }
                        />
                        <input
                          onChange={fileHandler}
                          type="file"
                          id="photos"
                          name="photos"
                          multiple
                          className="hidden"
                        />
                      </div>
                      <h3 className="font-medium text-[20px] mt-4">
                        Additional Images
                      </h3>
                      <div className="grid grid-cols-3 relative pb-[40px] gap-4 mt-2">
                        {photos.map((photo, index) => (
                          <div className="relative" key={index}>
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Photo ${index}`}
                              className="rounded-lg relative w-[100px] h-[100px]"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center"
                              onClick={() => deletePhoto(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className=" mb-[20px]">
                    <Input
                      {...formik.getFieldProps("productName")}
                      type="text"
                      placeholder="Product Name"
                      labelPlacement="outside"
                      radius="sm"
                      size="lg"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 w-[full] text-medium">
                            <LuShirt />
                          </span>
                        </div>
                      }
                    />
                  </div>

                  {/* Show Category */}

                  <div className="pt-[3px] flex justify-center items-center pb-[20px]">
                    <div className="min-w-[290px]">
                      <Select
                        items={category}
                        placeholder="Select a Category"
                        labelPlacement="outside"
                        classNames={{
                          base: "max-w-xs",
                          trigger: "h-12",
                        }}
                        renderValue={(items) =>
                          items.map((item) => (
                            <div
                              key={item.key}
                              className="flex py-[4px] px-[4px] items-center gap-2"
                            >
                              <Avatar
                                alt={item.data.photo}
                                className="flex-shrink-0"
                                size="sm"
                                src={item.data.photo}
                                isBordered
                                color="success"
                              />
                              <div className="flex flex-col">
                                <span>{item.data.name}</span>
                                <span className="text-default-500 text-tiny">
                                  {/* {item.data.phone} */}
                                </span>
                              </div>
                            </div>
                          ))
                        }
                      >
                        {(user) => (
                          <SelectItem key={user._id} textValue={user.name}>
                            <div
                              onClick={() => setSelectCategory(user.name)}
                              className="flex gap-2 py-[3px] px-[4px] items-center"
                            >
                              <Avatar
                                isBordered
                                // color={"suc"}
                                alt={user.name}
                                className="flex-shrink-0"
                                size="sm"
                                src={user.photo}
                              />
                              <div className="flex flex-col">
                                <span className="text-small">{user.name}</span>
                                <span className="text-tiny text-default-400">
                                  {user.phone}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        )}
                      </Select>
                    </div>
                  </div>

                  

                  <div className="mb-[20px] ">
                    <Input
                      {...formik.getFieldProps("price")}
                      type="number"
                      placeholder="Price"
                      labelPlacement="outside"
                      radius="sm"
                      size="lg"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 w-[full] text-medium">
                            $
                          </span>
                        </div>
                      }
                    />
                  </div>
                  <div className=" mb-[20px]">
                    <Input
                      {...formik.getFieldProps("stock")}
                      type="number"
                      placeholder="Stock"
                      labelPlacement="outside"
                      radius="sm"
                      size="lg"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 w-full text-medium">
                            <LuShirt />
                          </span>
                        </div>
                      }
                    />
                  </div>
                </div>

                <div className="flex hidden md:block justify-center items-center flex-col">
                  <div>
                    <div>
                      <img
                        className="rounded-xl p-2 w-[300px] h-[300px] cursor-pointer"
                        src={imageUrl}
                        onClick={() =>
                          document.getElementById("photos").click()
                        }
                      />
                      <input
                        onChange={fileHandler}
                        type="file"
                        id="photos"
                        name="photos"
                        multiple
                        className="hidden"
                      />
                    </div>
                    <h3 className="font-medium text-[20px] mt-4">
                      Additional Images
                    </h3>
                    <div className="grid grid-cols-3 relative pb-[40px] gap-4 mt-2">
                      {photos.map((photo, index) => (
                        <div className="relative" key={index}>
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Photo ${index}`}
                            className="rounded-lg relative w-[100px] h-[100px]"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center"
                            onClick={() => deletePhoto(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mb-[30px] justify-center items-center">
                <button
                  onClick={(e) => {
                    handleDraft(e);
                  }}
                  className="bg-black mx-[15px] rounded-lg flex justify-center items-center text-white px-6 text-[18px] py-2"
                >
                  <MdOutlineArrowDropDown className="mr-[15px]" />
                  Draft
                </button>
                <button
                  onClick={(e) => {
                    handlePublished(e);
                  }}
                  className="bg-primary rounded-lg flex justify-center items-center text-white px-6 text-[18px] py-2"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default AddProduct;
