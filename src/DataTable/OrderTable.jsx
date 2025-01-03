import React , {useState , useEffect} from "react";
import { useProductContext } from "../context/productContext";
import { loader } from "../assets";

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Avatar,
  AvatarGroup,
} from "@nextui-org/react";
import {PlusIcon} from "./PlusIcon";
import {VerticalDotsIcon} from "./VerticalDotsIcon";
import {SearchIcon} from "./SearchIcon";
import {ChevronDownIcon} from "./ChevronDownIcon";
// import {columns, statusOptions} from "./data";
import {capitalize} from "./utils";
import { NavLink, useNavigate } from "react-router-dom";
import { deleteAPI, getOrders } from "../helper/helper";
import toast from "react-hot-toast";
import PriceFormatter from "../helper/priceFormatter";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  {name : "Product Image", uid: "productImages"},
  { name: "PRODUCT NAME", uid: "name", sortable: true },
  { name: "ORDER DATE", uid: "orderDate", sortable: true },
  // { name: "QUANTITY", uid: "quantity", sortable: true },
  {name: "CUSTOMER NAME", uid: "customerName"},
  { name: "PAYMENT TYPE", uid: "paymentType", sortable: true },
  { name: "TOTAL PRICE", uid: "total", sortable: true },
  { name: "PHONE", uid: "phone" },
  { name: "STATUS", uid: "status", sortable: true },
  { name : "ORDER TYPE" , uid : "orderType"},
  { name: "ORDER NOTE", uid: "orderNote" },
  { name: "ACTIONS", uid: "actions" },
  { name : "REJECTION REASON" , uid : "rejectionReason"}
];

const statusOptions = [
  { name: "Completed", uid: "completed" },
  { name: "Pending", uid: "pending" },
  { name: "In-Progress", uid: "progress" },
  { name : "Cancelled" , uid : "cancelled"}
];

const orderTypeOptions = [
  { name: "Dine-In", uid: "dineIn" },
  { name: "Take-Away", uid: "takeAway"},
  { name: "Home-Delivery", uid: "homeDelivery"}
];

const orderTypeColorMap = {
  dineIn: "success",
  takeAway: "danger",
  homeDelivery: "warning",
};

const statusColorMap = {
  completed: "success",
  pending : "primary",
  progress: "warning",
  cancelled: "danger"
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "orderDate",
  "quantity",
  "paymentType",
  "total",
  "status",
  "actions",
  // "orderType"
];

export default function OrderTable() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const [loading , setLoading] = useState(false);

  const toggleModal = () => {
    setIsOpen((prevState) => !prevState);
    console.log(isOpen); 
  };

  const viewOrderDetails = (e, id) => {
    e.preventDefault();
    console.log("View Order Details");
    navigate(`/order-view/${id}`);
  };

  const downloadInvoice = (e, id) => {
    e.preventDefault();
    console.log("View Order Details");
    window.location.href = `${API_URL}/invoice/invoice/${id}`;
  };


  const deleteOrder = async (id) => {
    // alert("Are you sure you want to delete this order... ?");
    setLoading(true);

    try {
      const res = await deleteAPI(id);
      console.log("Response:", res);
      setLoading(false);
      fetchOrders();
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
       
      const { data } = await getOrders(`/orders`);
      console.log("Orders:", data);

      const newUsers = data.orders.map((order) => {
        console.log("Order:", order.products);

        const singleProducts = order.products.map((product) => product.product);
        console.log("Single Products:", singleProducts);

        const productNames = singleProducts.map(
          (product) => product.productName
        );
        const productImages = singleProducts.map((product) => product.photos);

        const firstImage =
          productImages.length > 0
            ? productImages[0]
            : "https://res.cloudinary.com/drku1djt5/image/upload/fl_preserve_transparency/v1723651866/delivery-man_v3vwub.jpg?_s=public-apps";

        console.log("First Image:", firstImage);

        const firstProductName = productNames[0] || "No Product Name";
        const totalProducts = productNames.length;
        const orderDate = new Date(order.createdAt);

        return {
          id: order._id,
          name: firstProductName,
          productImages: productImages,
          avatar: firstImage,
          total: <PriceFormatter price={order.price} />,
          phone: order.phone,
          totalProducts: totalProducts,
          status: order.orderStatus,
          newCustomer: order.newCustomer,
          customerName: order.customerName,
          orderNote: order.orderNote,
          paymentType: order.paymentType,
          products: order.products,
          quantity: order.quantity,
          orderType: order.orderType,
          orderDate: orderDate.toLocaleDateString(),
          invoice: order.invoice,
          rejectionReason: order.orderRejectionReason,
          invoiceId : order.invoiceId
        };
      });

      setUsers(newUsers);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };



  useEffect(() => {
    fetchOrders();
    console.log(isOpen); // This will log the updated state value
  }, [isOpen]);

  console.log("users", users);
  
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(users.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <NavLink to={`/order-view/${user.id}`}>
            <h2>{user.name}</h2>
          </NavLink>
        );
      case "productImages":
        return (
          <AvatarGroup
            isBordered
            max={3}
            total={user.totalProducts}
            renderCount={(count) => (
              <>
                {count - 1 > 0 && (
                  <p className="text-small text-foreground font-medium ms-2">
                    +{count - 1} others
                  </p>
                )}
              </>
            )}
          >
            {user.productImages.map((image) => (
              <Avatar
                src={
                  image ||
                  "https://res.cloudinary.com/drku1djt5/image/upload/fl_preserve_transparency/v1723651866/delivery-man_v3vwub.jpg?_s=public-apps"
                }
              />
            ))}
          </AvatarGroup>
        );
      case "role":
        return (
          <div className="flex font-poppins flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-500">
              {user.team}
            </p>
          </div>
        );
      case "orderDate":
        return (
          <div className="flex font-poppins flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-500">
              {user.team}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize font-poppins border-none gap-1 text-default-600"
            color={statusColorMap[user.status]}
            size="sm"
            variant="dot"
          >
            {cellValue}
          </Chip>
        );
      case "orderType":
        return (
          <Chip
            className="capitalize font-poppins border-none gap-1 text-default-600"
            color={orderTypeColorMap[user.orderType]}
            size="sm"
            variant="dot"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative font-poppins flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={(e) => viewOrderDetails(e, user.id)}>
                  View
                </DropdownItem>
                {/* <DropdownItem>Edit</DropdownItem> */}
                {/* <DropdownItem onClick={() => deleteOrder(user.id)}>
                  Delete
                </DropdownItem> */}
                <DropdownItem onClick={(e) => downloadInvoice(e, user.invoiceId)}>
                  Donwload Bill
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
        case "rejectionReason":
        return (
          <div className="flex font-poppins flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-500">
              {user.team}
            </p>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);


  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex font-poppins flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Order Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {orderTypeOptions.map((orderType) => (
                  <DropdownItem key={orderType.uid} className="capitalize">
                    {orderType.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <NavLink to={`/menu/-1`}>
              <button className="px-[10px] text-white bg-primary py-1.5 rounded-xl">Create Order</button>
            </NavLink>
          </div>
        </div>
        <div className="flex font-poppins justify-between items-center">
          <span className="text-default-400 text-small">
            Total {users.length} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 font-poppins px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-primary text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center">
          <img src={loader} />
        </div>
      )}
      {!loading && (
        <Table
          isCompact
          removeWrapper
          aria-label="Example table with custom cells, pagination and sorting"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          checkboxesProps={{
            classNames: {
              wrapper: "after:bg-primary after:text-background text-background",
            },
          }}
          classNames={classNames}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No orders found"} items={sortedItems}>
            {sortedItems.map((item) => (
              <TableRow key={item.id}>
                {headerColumns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(item, column.uid)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
