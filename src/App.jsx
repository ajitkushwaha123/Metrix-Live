import './App.css'
import Sidebar from './components/Sidebar'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Order from './Pages/Order'
import Inventory from './Pages/Inventory'
import Settings from './Pages/Settings'
import Conversations from './Pages/Conversations'
import Gift from './Pages/Gift'
import Logout from './Authentication/Logout'
import Login from './Authentication/Login'
import Register from './Authentication/Register'
import ForgetPassword from './Authentication/ForgetPassword'
import { AuthorizeUser } from './middleware/auth'
import NewInventory from './Pages/NewInventory'
import SingleProduct from './Pages/SingleProduct'
import AddCategory from './Pages/AddCategory'
import Category from './Pages/Category'
import DetailCategory from './Pages/DetailCategory'
import UpdateCategory from './Pages/UpdateCategory'
import ImageGenerator from './components/Gemini'
import Prod from './components/Gemini'
import UpdateProduct from './Pages/UpdateProduct'
import ViewProduct from './Pages/ViewProduct'
import ViewOrder from './Pages/ViewOrder'
import Customer from './Pages/Customers/Customer'
import UpdateCustomer from './Pages/Customers/UpdateCustomer'
import ViewCustomer from './Pages/Customers/ViewCustomer'
import Navbar from './components/Navbar'
import TableBooking from './components/TableBooking'
import Menu from './components/Menu'
import UploadMenu from './Pages/UploadMenu/UploadMenu'
import Protected from './components/Protected'
import Support from './Pages/Support/Support'
import ItemTable from './Pages/UploadMenu/ItemTable'
import { useState ,  useEffect } from 'react'
import Internet from './Modals/Internet'
import EditMenu from './components/EditMenu'

function App() {

  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
  }, []);

  return (
    <BrowserRouter>
      <div className="flex w-[100%]">
        {/* {online ? "Online" : "offfline"} */}
        <div>
          {online ? (
            null
          ) : (
            <div className="w-full h-screen flex jsutify-center items-center">
              <Internet isOpen={true} />
            </div>
          )}
        </div>
        <div className="">
          <Sidebar />
        </div>

        <div className="w-[100%]">
          <div>
            <div>
              <Navbar />
            </div>
            <div>
              <Routes>
                {/* <Route path="/" element={<Login />} /> */}
                <Route path="/" element={<Protected component={Dashboard} />} />
                <Route
                  path="/dashboard"
                  element={<Protected component={Dashboard} />}
                />
                <Route
                  path="/order"
                  element={<Protected component={Order} />}
                />
                <Route
                  path="/inventory"
                  element={<Protected component={Inventory} />}
                />
                <Route
                  path="table-booking"
                  element={<Protected component={TableBooking} />}
                />
                <Route
                  path="/menu/:id"
                  element={<Protected component={Menu} />}
                />
                <Route path="/menu/:id/:orderId/:invId" element={<Protected component={EditMenu} />} />
                <Route
                  path="/upload-menu"
                  element={<Protected component={UploadMenu} />}
                />
                <Route
                  path="/item-table"
                  element={<Protected component={ItemTable} />}
                />
                <Route
                  path="/inventory/new-product"
                  element={<Protected component={NewInventory} />}
                />
                <Route
                  path="/profile"
                  element={<Protected component={Settings} />}
                />
                <Route
                  path="/conversations"
                  element={<Protected component={Conversations} />}
                />
                <Route
                  path="/customer"
                  element={<Protected component={Customer} />}
                />
                <Route
                  path="/support"
                  element={<Protected component={Support} />}
                />
                <Route path="/gift" element={<Protected component={Gift} />} />
                <Route
                  path="/logout"
                  element={<Protected component={Logout} />}
                />
                <Route
                  path="/singleproduct/:id"
                  element={<Protected component={SingleProduct} />}
                />
                <Route
                  path="add-category"
                  element={<Protected component={AddCategory} />}
                />
                <Route
                  path="/category"
                  element={<Protected component={Category} />}
                />
                <Route
                  path="/category/:id"
                  element={<Protected component={DetailCategory} />}
                />
                <Route
                  path="/category/edit/:id"
                  element={<Protected component={UpdateCategory} />}
                />
                <Route
                  path="/gemini"
                  element={<Protected component={ImageGenerator} />}
                />
                <Route path="/prod" element={<Protected component={Prod} />} />
                <Route
                  path="/inventory/update-product/:id"
                  element={<Protected component={UpdateProduct} />}
                />
                <Route
                  path="/inventory/view/:id"
                  element={<Protected component={ViewProduct} />}
                />
                <Route
                  path="/order-view/:id"
                  element={<Protected component={ViewOrder} />}
                />
                <Route
                  path="/customer/edit/:id"
                  element={<Protected component={UpdateCustomer} />}
                />
                <Route
                  path="/customer/view/:id"
                  element={<Protected component={ViewCustomer} />}
                />
              </Routes>
            </div>
          </div>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App
