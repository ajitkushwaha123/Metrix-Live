import React, { useState, useEffect } from "react";
import { metrix } from "../assets";
import { MdDashboardCustomize } from "react-icons/md";
import { BsHandbag } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";
import { BsFolder2Open } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { FiLogOut } from "react-icons/fi";
import { GoGift } from "react-icons/go";
import { MdOutlineTableBar } from "react-icons/md";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  function userLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

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
      title: "Inventory",
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
  ];

  const [isActive, setIsActive] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const activeLink = navLinks.find((nav) => location.pathname === nav.link);
    setIsActive(activeLink?.link);
  }, [location]);

  return (
    <div className="hover:w-[296px] hidden sm:block w-[88px] pb-[30px] h-screen font-poppins group bg-[#fff]">
      <div className="w-[100%] flex justify-start group-hover:px-[50px] px-[20px] items-center h-[100px]">
        <img className="w-[50px] h-[50px]" src={metrix} alt="Metrix Logo" />
        <h3 className="text-black ml-[10px] font-poppins font-bold text-[25px] hidden group-hover:block">
          Metrix
        </h3>
      </div>

      <div className="flex flex-col justify-center items-center">
        {/* Navigation Links */}
        <div className="overflow-y-scroll chalaja h-[500px] ">
          <ul
            className={`flex flex-col justify-center items-center font-poppins`}
          >
            {navLinks.map((nav, index) => (
              <li
                key={index}
                className={`flex items-center h-[49px] hover:bg-[#5570F1] rounded-lg group-hover:w-[233px] hover:text-white text-[20px] px-[14px] group-hover:px-[30px] my-[3px] ${
                  isActive === nav.link ? "bg-[#5570F1] text-white" : ""
                }`}
                aria-label={nav.title}
                onClick={() => setIsActive(nav.link)}
              >
                {nav.icon}
                <span className="hidden group-hover:block ml-[10px]">
                  <NavLink to={nav.link}>{nav.title}</NavLink>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="font-poppins flex justify-center items-center flex-col absolute bottom-0">
          <NavLink to="/support">
            <li className="flex items-center h-[53px] bg-[#eff0f0] rounded-lg group-hover:w-[233px] text-[#212227] text-[16px] px-[15px] group-hover:px-[30px]">
              <TfiHeadphoneAlt className="group-hover:mr-[10px] text-[20px]" />
              <p className="hidden group-hover:block">Contact Support</p>
            </li>
          </NavLink>
          <NavLink to="/gift">
            <li className="flex items-center h-[53px] rounded-lg group-hover:w-[233px] text-[16px] bg-[#fff5e9] group-hover:pl-[30px] px-[15px] mt-[10px]">
              <GoGift className="group-hover:mr-[10px] text-[20px]" />
              <p className="hidden group-hover:block">Free Gift Awaits You!</p>
            </li>
          </NavLink>
          <NavLink onClick={userLogout} to={"/login"}>
            <li className="flex items-center h-[53px] rounded-lg group-hover:w-[233px] text-[16px] text-[#db9292] px-[15px] group-hover:px-[30px] my-[3px]">
              <FiLogOut className="group-hover:mr-[10px] text-[20px]" />
              <p className="hidden group-hover:block">Logout</p>
            </li>
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
