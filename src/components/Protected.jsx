import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";

const Protected = ({ component: Component }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // toast.error("Login to Proceed ...!");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      <div>{localStorage.getItem("token") ? <Component /> : null}</div>
    </>
  );
};

export default Protected;
