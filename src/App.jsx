import './App.css'
import Sidebar from './components/Sidebar'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Order from './Pages/Order'
import Inventory from './Pages/Inventory'
import Settings from './Pages/Settings'
import Conversations from './Pages/Conversations'
import Support from './Pages/Support'
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
import NewCustomer from './Pages/Customers/AddCustomer'
import UpdateCustomer from './Pages/Customers/UpdateCustomer'
import ViewCustomer from './Pages/Customers/ViewCustomer'

function App() {

  return (
    <BrowserRouter>
      <div className="flex w-[100%]">
        <div className="">
          <Sidebar />
        </div>

        <div className="w-[100%]">
          <Routes>
            <Route  path='/' element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/order" element={<Order />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/new-product" element={<NewInventory />} />
            <Route path="/profile" element={<Settings />} />
            <Route path="/conversations" element={<Conversations />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/support" element={<Support />} />
            <Route path="/gift" element={<Gift />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/singleproduct/:id" element={<SingleProduct />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="/category" element={<Category />} />
            <Route path="/category/:id" element={<DetailCategory />} />
            <Route path="/category/edit/:id" element={<UpdateCategory />} />
            <Route path='/gemini' element={<ImageGenerator />} />
            <Route path='/prod' element={<Prod />} />
            <Route path='/inventory/update-product/:id' element={<UpdateProduct />} />
            <Route path='/inventory/view/:id' element={<ViewProduct />} />
            <Route path='/order-view/:id' element={<ViewOrder />} />
            <Route path='/customer/edit/:id' element={<UpdateCustomer />} />
            <Route path="/customer/view/:id" element={<ViewCustomer /> } />
            {/* <Route path="/add-customer" element={<NewCustomer />} /> */}
          </Routes>

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
