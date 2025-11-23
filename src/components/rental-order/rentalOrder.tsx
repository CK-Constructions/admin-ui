import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RentalOrder as RentalOrderType } from "../lib/types/response";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { Box, Chip, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import Loading from "../common/Loader";
import Header from "../common/Header";
import { MoreVerticalIcon } from "lucide-react";
import ViewRentalOrder from "./ViewRentalOrder";

// ✅ Import the reusable modal

export const countStyle = "flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200";

const RentalOrderList: React.FC = () => {
  const navigate = useNavigate();
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // dropdown state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOrder, setMenuOrder] = useState<RentalOrderType | null>(null);
  const menuOpen = Boolean(anchorEl);

  // ✅ Modal state
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { queryFn: rentalorderFunc, queryKeys: rentalorderKey } = queryConfigs.useGetAllRentalOrder;

  const { data, isLoading, isLoadingError, isFetching, isRefetching, isRefetchError } = useGetQuery({
    func: rentalorderFunc,
    key: rentalorderKey,
    params: {
      limit,
      offset: (currentPage - 1) * limit,
    },
  });

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // --- menu handlers ---
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, order: RentalOrderType) => {
    setAnchorEl(event.currentTarget);
    setMenuOrder(order);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOrder(null);
  };

  // ----- actions -----
  const handleAction = (action: string) => {
    if (!menuOrder) return;

    switch (action) {
      case "cancel":
        console.log("Cancel", menuOrder.id);
        break;
      case "redirect":
        navigate(`/orders/${menuOrder.id}`);
        break;
      case "update":
        console.log("Update", menuOrder.id);
        break;
      case "view":
        // ✅ Open the modal and set the selected order id
        setSelectedOrderId(menuOrder.id);
        setViewOpen(true);
        break;
      case "print":
        window.print();
        break;
      default:
        break;
    }

    handleMenuClose();
  };

  // --- loading & error states ---
  if (isLoading || isFetching || isRefetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Loading />
      </Box>
    );
  }

  if (isLoadingError || isRefetchError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">Error loading rental orders. Please try again.</Typography>
      </Box>
    );
  }

  // --- safely extract orders list ---
  const orders: RentalOrderType[] = Array.isArray(data?.result?.list) ? data?.result.list : [];
  const totalCount: number = data?.result?.count ?? orders.length;

  if (orders.length === 0) {
    return (
      <Box display="flex" flexDirection="column" height="100%">
        <div className="pb-4">
          <Header onBackClick={() => navigate(-1)} pageName="Rental Orders" />
        </div>
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
          <Typography>No orders found</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="pb-4">
        <Header onBackClick={() => navigate(-1)} pageName="Rental Orders" />
      </div>

      <TableContainer sx={{ maxHeight: 540 }} component={Paper}>
        <Table stickyHeader aria-label="rental orders table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>Order ID</TableCell>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>Name</TableCell>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>Rate</TableCell>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>Payment Status</TableCell>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>Order Status</TableCell>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.rental_name ?? "-"}</TableCell>
                <TableCell>₹{order.rental_rate_id ?? 0}</TableCell>
                <TableCell>
                  <Chip
                    label={order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : "N/A"}
                    color={order.payment_status === "success" ? "success" : order.payment_status === "pending" ? "warning" : "error"}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.order_status ? order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1) : "N/A"}
                    color={order.order_status === "completed" ? "success" : order.order_status === "pending" ? "warning" : "info"}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Actions">
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, order)}>
                      <MoreVerticalIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
        <MenuItem onClick={() => handleAction("cancel")}>Cancel</MenuItem>
        <MenuItem onClick={() => handleAction("redirect")}>Redirect</MenuItem>
        <MenuItem onClick={() => handleAction("update")}>Update</MenuItem>
        <MenuItem onClick={() => handleAction("view")}>View</MenuItem>
        <MenuItem onClick={() => handleAction("print")}>Print</MenuItem>
      </Menu>

      <div className="flex items-center justify-center mt-5">
        <p className="flex items-center space-x-2 font-medium text-slate-700">
          <span>Total result:</span>
          <span className={countStyle}>{totalCount}</span>
        </p>
      </div>

      {/* ✅ ViewRentalOrder Modal */}
      {selectedOrderId && <ViewRentalOrder open={viewOpen} onClose={() => setViewOpen(false)} orderId={selectedOrderId} />}
    </div>
  );
};

export default RentalOrderList;
