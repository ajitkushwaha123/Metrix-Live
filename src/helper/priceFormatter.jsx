import React from "react";

const PriceFormatter = ({ price = 10000 }) => {
  return (
    <span>
      {new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(price)}
    </span>
  );
};

export default PriceFormatter;
