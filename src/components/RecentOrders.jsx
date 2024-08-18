import React, { useEffect, useState } from "react";
import { getOrders } from "../helper/helper";
import Skeleton from "react-loading-skeleton";
import { Pagination } from "@nextui-org/react";
import { productImg } from "../assets";
import { NavLink } from "react-router-dom";
import PriceFormatter from "../helper/priceFormatter";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 8;
  const [firstImage, setFirstImage] = useState([]);
  const [firstProduct, setFirstProduct] = useState("");

  const fetchOrders = async (page) => {
    setIsLoading(true);
    try {
      const { data } = await getOrders(
        `orders?page=${page}&limit=${ordersPerPage}`
      );
      setOrders(data.orders);
      setTotalOrders(data.totalOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupProductImages = (orders) => {
    console.log("Orders:", orders);
    const products = orders.flatMap((order) => order.products || []);
    const productDetails = products.map((product) => product.product || {});
    console.log("Product Details:", productDetails);

    const productImages = productDetails.map((product) => product.photos || []);
    const firstImages =
      productImages.length > 0
        ? productImages.map((photos) => photos[0])
        : [
            "https://res.cloudinary.com/drku1djt5/image/upload/fl_preserve_transparency/v1723651866/delivery-man_v3vwub.jpg?_s=public-apps",
          ];

    setFirstProduct(productDetails[0]?.productName || "No Product Name");
    setFirstImage(firstImages);
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  useEffect(() => {
    if (orders.length > 0) {
      setupProductImages(orders);
    }
  }, [orders]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const formattedDate = (dateString) => {
    const dateObject = new Date(Date.parse(dateString));
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(dateObject);
  };
  return (
    <>
      <div className="bg-white py-5 rounded-md">
        <h2 className="text-start text-[18px] px-7 font-medium pb-[12px]">
          Recent Orders
        </h2>
        {isLoading ? (
          <div className="w-full">
            <Skeleton height={600} width={501} />
          </div>
        ) : (
          <div className="md:px-7">
            {totalOrders === 0 ? (
              <div className="flex py-[50px] justify-center items-center flex-col">
                <img width={"200px"} src={productImg} alt="No Orders" />
                <p className="font-medium my-[20px] font-poppins text-[22px]">
                  No Orders Yet
                </p>
                <p>
                  Add products to your store and start selling to see orders
                  here.
                </p>
                <NavLink to={"/inventory/new-product"}>
                  <button className="bg-primary text-white px-5 py-2 rounded-md mt-5">
                    + Add Products
                  </button>
                </NavLink>
              </div>
            ) : (
              <div className="max-h-[700px] overflow-y-scroll chalaja">
                {orders.map((order, index) => (
                  <div
                    key={index}
                    className="flex border-b-2 rounded-lg border-slate-100 px-5 py-2 justify-between"
                  >
                    <div className="flex">
                      <div>
                        <img
                          className="w-[60px] h-[60px] object-cover rounded-md"
                          src={
                            firstImage[index] ||
                            "https://res.cloudinary.com/drku1djt5/image/upload/fl_preserve_transparency/v1723651866/delivery-man_v3vwub.jpg?_s=public-apps"
                          }
                          alt="Order item"
                        />
                      </div>
                      <div className="ml-[20px] flex flex-col text-start">
                        <div>
                          {order.products.length > 0 && (
                            <h3>
                              {order.products[0].product?.productName ||
                                "No Product Name"}
                            </h3>
                          )}
                        </div>
                        <div>{<PriceFormatter price={order.price} />}</div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <p>{formattedDate(order.createdAt)}</p>
                      </div>
                      {order.orderStatus === "completed" && (
                        <div className="bg-secondary rounded-sm mt-[8px]">
                          <h2 className="text-success">Completed</h2>
                        </div>
                      )}
                      {order.orderStatus === "pending" && (
                        <div className="bg-secondary rounded-sm mt-[8px]">
                          <h2 className="text-primary">Pending</h2>
                        </div>
                      )}
                      {order.orderStatus === "progress" && (
                        <div className="bg-secondary rounded-sm px-[4px] mt-[8px]">
                          <h2 className="text-warning">In Progress</h2>
                        </div>
                      )}
                      {order.orderStatus === "cancelled" && (
                        <div className="bg-secondary rounded-sm px-[4px] mt-[8px]">
                          <h2 className="text-warning">Cancelled</h2>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center pb-[14px]">
        <Pagination
          isCompact
          total={Math.ceil(totalOrders / ordersPerPage)}
          initialPage={page}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default RecentOrders;
