import React, { useEffect, useState } from "react";
import { LuShirt } from "react-icons/lu";
import { useFormik } from "formik";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useProductContext } from "../context/productContext";
import { updateProduct , getCategory } from "../helper/helper";
import { Textarea, Input, Checkbox } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { Select, SelectItem  , Avatar} from "@nextui-org/react";


const UpdateComponent = () => {
  const navigate = useNavigate();
  const { getSingleProduct, isSingleLoading, singleProduct } =
    useProductContext();
  const { id } = useParams();

  const [cloudinaryPhotos, setCloudinaryPhotos] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [imageUrl, setImageUrl] = useState('https://cdn-icons-png.flaticon.com/128/9093/9093050.png'); // Replace with your initial image URL
  const [draft, setDraft] = useState(false);
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
    getSingleProduct(`/products/${id}`);
    fetchCategory();
  }, [id]);

  useEffect(() => {
    if (singleProduct.photos) {
      setCloudinaryPhotos(singleProduct.photos || '');
      setImageUrl(singleProduct.photos[0] || '');
      formik.setFieldValue("productName", singleProduct.productName);
      formik.setFieldValue("category", singleProduct.category);
      formik.setFieldValue("price", singleProduct.price);
      formik.setFieldValue("stock", singleProduct.stock);
      setSelectCategory(singleProduct.category);
    }
  }, [singleProduct]);

  const fileHandler = (e) => {
    const files = Array.from(e.target.files);
    setUploadedPhotos((prevPhotos) => {
      const updatedPhotos = [...prevPhotos, ...files];
      formik.setFieldValue("photos", [...cloudinaryPhotos, ...updatedPhotos]);
      return updatedPhotos;
    });

    if (files.length > 0) {
      const file = files[0];
      if (file instanceof Blob) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          setImageUrl(event.target.result);
        };
        fileReader.readAsDataURL(file);
      } else {
        console.error("The selected file is not a valid Blob or File object.");
      }
    }
  };

  const deletePhoto = (index, type) => {
    if (type === "cloudinary") {
      setCloudinaryPhotos((prevPhotos) =>
        prevPhotos.filter((_, i) => i !== index)
      );
    } else {
      setUploadedPhotos((prevPhotos) =>
        prevPhotos.filter((_, i) => i !== index)
      );
    }
    formik.setFieldValue("photos", [...cloudinaryPhotos, ...uploadedPhotos]);
  };

  const formik = useFormik({
    initialValues: {
      _id: singleProduct._id,
      productName: singleProduct.productName,
      category: singleProduct.category,
      price: singleProduct.price,
      stock: singleProduct.stock,
      photos: [...cloudinaryPhotos, ...uploadedPhotos],
      status : "published",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values.category = selectCategory;
      values.photos = [...cloudinaryPhotos, ...uploadedPhotos];
      values._id = singleProduct._id;

      if(draft){
        values.status = "draft";
      }
      console.log("Formik values", values);
      let updateProductPromise = updateProduct(values);
      toast.promise(updateProductPromise, {
        loading: "Creating...",
        success: <b>Product Updated Successfully... !</b>,
        error: <b>Error Updating Product... !</b>,
      });

      updateProductPromise.then(function () {
        navigate("/inventory");
      });
    },
  });

  const handleDraft = (e) => {
    e.preventDefault();
    setDraft(true);
    formik.handleSubmit();
  };

  const handlePublished = (e) => {
    e.preventDefault();
    setDraft(false);
    formik.handleSubmit();
  };

  return (
    <div className="">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex px-[40px] py-[20px] items-center">
        <p className="text-[22px] font-medium">Update Product</p>
      </div>
      <form className="flex w-full flex-col px-[30px] justify-center items-center rounded-xl items-center">
        <div className="px-[40px] min-w-[300px] max-w-[480px] mb-[30px] bg-white py-[20px] justify-center items-center flex ">
          <div className="font-poppins bg-white">
            {/* <div className="flex justify-center items-center flex-col">
              <div>
                <div className="flex justify-center items-center">
                  <img
                    className="rounded-xl p-2 w-[180px] h-[180px] cursor-pointer"
                    src={
                      imageUrl  ||
                      "https://cdn-icons-png.flaticon.com/128/9093/9093050.png"
                    }
                    onClick={() => document.getElementById("photos").click()}
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
                <div className="grid grid-cols-3 pb-[40px] gap-4 mt-2">
                  {cloudinaryPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Cloudinary Photo ${index}`}
                        className="rounded-lg w-[100px] h-[100px]"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => deletePhoto(index, "cloudinary")}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {uploadedPhotos?.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo || "")}
                        alt={`Uploaded Photo ${index}`}
                        className="rounded-lg w-[100px] h-[100px]"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => deletePhoto(index, "uploaded")}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}

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
                    <span className="text-default-400 text-medium">
                      <LuShirt />
                    </span>
                  </div>
                }
              />
            </div>

            <div className="pt-[3px] flex justify-center items-center pb-[20px]">
              <div className="min-w-[220px] max-w-[480px]">
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
                        <div className="flex flex-col">
                          <span>{selectCategory}</span>
                          <span className="text-default-500 text-tiny"></span>
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
              <NavLink to={"/add-category"}>
                <input type="checkbox" />
                Add New
                {/* <button className="bg-primary ml-[10px] text-white px-4 py-2 rounded-lg">
                  Create New
                </button> */}
              </NavLink>
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
                    <span className="text-default-400 text-medium"> ₹ </span>
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
                    <span className="text-default-400 text-medium">
                      <LuShirt />
                    </span>
                  </div>
                }
              />
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={(e) => {
                  handleDraft(e);
                }}
                className="bg-black mx-[15px] rounded-lg flex justify-center items-center text-white px-6 text-[18px] py-2"
              >
                <MdOutlineArrowDropDown className="mr-[15px]" />
                <span className="hidden md:block">Save as </span> Draft
              </button>
              <button
                onClick={(e) => {
                  handlePublished(e);
                }}
                className="bg-primary rounded-lg flex justify-center items-center text-white px-6 text-[18px] py-2"
              >
                <span className="hidden md:block">Save & </span> <p> Publish</p>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateComponent;
