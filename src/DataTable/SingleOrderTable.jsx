import React, { useState, useEffect } from "react";
import { useProductContext } from "../context/productContext";
import { loader } from "../assets";
// import AvatarGroup from "./Avatar";

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
import { PlusIcon } from "./PlusIcon";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
// import {columns, statusOptions} from "./data";
import { capitalize } from "./utils";
import { NavLink } from "react-router-dom";
import NewOrder from "../Pages/NewOrder";
import { deleteAPI, getSingleOrders } from "../helper/helper";
import { useParams } from "react-router-dom";
import axios from "axios";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Product Image", uid: "productImages" },
  { name: "PRODUCT NAME", uid: "name", sortable: true },
  { name: "QUANTITY", uid: "quantity", sortable: true },
  { name: "CATEGORY", uid: "category" },
  { name: "DISCOUNT PRICE", uid: "discountPrice", sortable: true },
  { name: "STOCK", uid: "stock", sortable: true },
  { name: "PRICE", uid: "price" },
  // { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Completed", uid: "completed" },
  { name: "Pending", uid: "pending" },
  { name: "In-Progress", uid: "progress" },
];

const statusColorMap = {
  completed: "success",
  pending: "danger",
  progress: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "productImages",
  "name",
  "category",
  // "status",
  "discountPrice",
  "stock",
  "price",
  "actions",
];

export default function SingleOrderTable() {
  
  const { id } = useParams();
  console.log("iddddd", id);

  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const deleteOrder = async (id) => {
    setIsLoading(true);
    try {
      const response = await deleteAPI(`${id}`);
      console.log("Response:", response);
      fetchOrders();
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting order:", error);
      setIsLoading(false);
    }
  };

 const [users, setUsers] = useState([]);

  const fetchOrders = async () => {
    try {
      const orders = await getSingleOrders(`orders/find/${id}`);
      console.log("Orderrrrr:", orders);
      const order = orders.products;
      console.log("Ordersss:", order);

      const singleproduct = order.map((product) => product.product);
      console.log("singleproduct", singleproduct);

      const updatedUsers = singleproduct.map((product) => ({
        id: product._id,
        name: product.productName,
        productImages: product.photos,
        category: product.category,
        status: product.orderStatus,
        avatar: product.photos[0],
        price: product.price,
        stock: product.stock,
        discountPrice: product.discountPrice,
      }));

      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

 useEffect(() => {
   fetchOrders();
 }, [id]);

 console.log("Users:", users);


  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
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

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
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
          <NavLink to={`/singleproduct/${user.id}`}>
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
              <Avatar src={image} />
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
                <DropdownItem>
                  <NavLink to={`/order-view/${user.id}`}>View</NavLink>
                </DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem onClick={() => deleteOrder(user.id)}>
                  {" "}
                  Delete{" "}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
                    {status}
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
            {/* <Button
              className="bg-primary text-background"
              endContent={<PlusIcon />}
              size="sm"
            >
            </Button> */}
            <NewOrder />
            {/* {isOpen == true && <NewOrder />} */}
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
    []
  );

  return (
    <>
      {isLoading && (
        <div>
          {" "}
          <img src={loader} />{" "}
        </div>
      )}
      {!isLoading && (
        <Table
          isCompact
          className="overflow-x-scroll chalaja"
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
          <TableBody emptyContent={"No users found"} items={sortedItems}>
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
