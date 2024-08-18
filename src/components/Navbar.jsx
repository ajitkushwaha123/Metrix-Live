import React, { useState } from "react";
import { FaBell } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import useFetch from "../hooks/fetch.hooks";
import { FaShop } from "react-icons/fa6";
import { logo, metrix } from "../assets";
import { PiHamburger } from "react-icons/pi";
import { MdDashboardCustomize } from "react-icons/md";
import { BsHandbag } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";
import { BsFolder2Open } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { FiLogOut } from "react-icons/fi";
import { GoGift } from "react-icons/go";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineTableBar } from "react-icons/md";
import { CgMenuBoxed } from "react-icons/cg";

const navLinks = [
  {
    title: "Dashboard",
    icon: <MdDashboardCustomize />,
    link: "/dashboard",
  },
  {
    title: "Orders",
    icon: <BsHandbag />,
    link: "/order",
  },
  {
    title: "Menu",
    icon: <BsFolder2Open />,
    link: "/inventory",
  },
  {
    title: "Customers",
    icon: <LuUsers />,
    link: "/customer",
  },
  {
    title: "Settings",
    icon: <IoSettingsOutline />,
    link: "/profile",
  },
  {
    title: "Table Booking",
    icon: <MdOutlineTableBar />,
    link: "/table-booking",
  },
  {
    title: "Upload Menu",
    icon: <CgMenuBoxed />,
    link: "/upload-menu",
  },
];

const Navbar = ({ title }) => {
  const navigate = useNavigate();
  function userLogout() {
    localStorage.removeItem("token");
    setToggle(!toggle);
    navigate("/login");
  }

  const [{ isLoading, apiData, serverError }] = useFetch();
  const [toggle, setToggle] = useState(false);
  const [active, setActive] = useState("Home");

  const handleNav = (e) => {
    e.preventDefault();
    setToggle(!toggle);
    console.log(toggle);
  };
  return (
    <>
      <div className="w-[100%] font-poppins h-[70px] border-b-2 border-secondary bg-[white] flex justify-between items-center sm:px-[40px]">
        <div className="flex justify-between items-center">
          <RxHamburgerMenu
            onClick={(e) => {
              handleNav(e);
            }}
            className="text-[20px] sm:hidden ml-[10px] mr-[5px]"
          />
          <div className="bg-primary sm:hidden p-2 rounded-xl">
            <img className="w-[28px] h-[28px]" src={logo} />
          </div>
          <div className="text-[22px] text-medium">
            <h2>{title}</h2>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <button className="bg-secondary flex justify-center items-center sm:px-[16px] px-[8px] sm:py-[8px] py-[4px] rounded-xl mr-[10px] sm:mr-[20px]">
            <FaShop className="mr-[5px] sm:mr-[10px]" />
            {apiData?.name || "Nancy Shop"}
          </button>
          <p className="text-primary hidden sm:block text-[20px] mx-[10px]">
            <FaBell />
          </p>
          <div className="w-[45px] mx-[10px] h-[45px] flex justify-center items-center bg-primary rounded-full">
            <img
              width={"40px"}
              height={"40px"}
              className="rounded-full w-[40px] h-[40px] object-cover"
              src={
                apiData?.profile ||
                "https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_3.jpg"
              }
            />
          </div>
        </div>
      </div>

      {toggle && (
        <div className="w-[100%] z-auto h-screen absolute shadow-lg shadow-indigo-500/40 backdrop-blur-sm bg-indigo-500/10">
          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 bg-white absolute top-20 z-auto right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
          >
            <ul className="list-none bg-white flex justify-end items-start flex-1 flex-col">
              {navLinks.map((nav, index) => (
                <li
                  key={nav.id}
                  className={`font-poppins flex justify-center items-center font-medium cursor-pointer text-[16px] ${
                    active === nav.title ? "text-primary" : "text-dimBlue"
                  }  mb-4`}
                  onClick={() => {
                    setActive(nav.title), setToggle(!toggle);
                  }}
                >
                  <p className="mr-[10px]">{nav.icon}</p>{" "}
                  <NavLink to={`${nav.link}`}>{nav.title}</NavLink>
                </li>
              ))}

              <li
                className={`font-poppins text-red-400 flex justify-center items-center font-medium cursor-pointer text-[16px]`}
              >
                <p className="mr-[10px]">
                  <FiLogOut />
                </p>
                <NavLink onClick={userLogout} to={"/login"}>
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
