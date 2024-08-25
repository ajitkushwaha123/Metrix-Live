import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Protected = ({ component: Component }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return <div>{localStorage.getItem("token") ? <Component /> : null}</div>;
};

export default Protected;
