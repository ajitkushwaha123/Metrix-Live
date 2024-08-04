import React , {useState , useEffect} from 'react'
import Navbar from '../components/Navbar'
import BreadCrum from '../components/BreadCrum'
import { LuUsers2 } from "react-icons/lu";
import { BsHandbag } from "react-icons/bs";
import Stats from '../components/Stats';
import { BsFolder2Open } from 'react-icons/bs';
import { TiPlus } from "react-icons/ti";
import InvTable from '../DataTable/Table';
import { NavLink } from 'react-router-dom';
import { getProductDetail , getCustomerDetail } from '../helper/helper';


const Inventory = () => {

  const [totalProduct, setTotalProduct] = useState(0);
  const [totalPublished, setTotalPublished] = useState(0);
  const [totalDraft , setTotalDraft] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [expired, setExpired] = useState(0);
  const [sufficientStock, setSufficientStock] = useState(0);

  const fetchProductsDetails = async () => {
    try {
      const res = await getProductDetail();
      setTotalProduct(res.data.productDetail.total);
      setTotalPublished(res.data.productDetail.totalPublished);
      setTotalDraft(res.data.productDetail.totalDraft);
      setLowStock(res.data.productDetail.lowStock);
      setExpired(res.data.productDetail.expired);
      setSufficientStock(res.data.productDetail.sufficientStock);
      console.log("product Detail");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductsDetails();
  }, []);

  return (
    <div>
      <BreadCrum title={"Inventory"} back={"/"} />
      <div className="flex justify-between items-center px-[15px] md:px-[30px] py-[10px]">
        <h3 className="font-normal pt-[10px] text-[20px] font-poppins">
          <span className='hidden md:block'>Inventory</span> Summary
        </h3>
        <NavLink to={"/inventory/new-product"}>
          <button className="bg-primary rounded-lg flex justify-center items-center text-white px-6 text-[18px] py-2">
            <TiPlus className="mr-[15px]" />
            Add Product
          </button>
        </NavLink>
      </div>

      {/* Stats */}
      <div className="flex flex-col md:flex-row px-[15px] md:px-[28px] py-[10px]">
        <div className="w-[100%] md:w-[45%] mt-[4px]">
          <Stats
            bgColor="primary"
            height="170px"
            icon={<BsFolder2Open />}
            title1={"All Products"}
            title2={"Published"}
            title3={"Draft"}
            stat1={totalProduct}
            stat2={totalPublished}
            stat3={totalDraft}
            padY={"10"}
            txtColor={"white"}
            present={"1"}
            dropdown={false}
          />
        </div>
        <div className="w-[100%] mt-[20px] md:mt-[0px] md:w-[55%] md:ml-[30px]">
          <Stats
            icon={<BsHandbag />}
            title1={"Low Stock Alert"}
            title2={"Expired"}
            txtColor={"text-red-200"}
            title3={"Sufficient Stock"}
            stat1={lowStock}
            stat2={expired}
            stat3={sufficientStock}
            present={"1"}
            dropdown={false}
          />
        </div>
      </div>

      <div className="px-[15px] md:px-[30px] py-[30px]">
        <div className="bg-white md:py-[40px] px-4 py-8 md:px-[40px]">
          <InvTable />
        </div>
      </div>
    </div>
  );
}

export default Inventory