import React from "react";
import { Modal, Box, Typography, Divider, IconButton, Paper, Stack, Chip, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { RentalOrder, RentalOrderDetail } from "../lib/types/response";
import dayjs from "dayjs";

interface ViewRentalOrderProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
}

const ViewRentalOrder: React.FC<ViewRentalOrderProps> = ({ open, onClose, orderId }) => {
  const { queryFn: rentalorderFunc, queryKeys: rentalorderKey } = queryConfigs.useGetRentalOrder;

  const { data, isLoading, isFetched } = useGetQuery({
    func: rentalorderFunc,
    key: rentalorderKey,
    params: { id: orderId ?? null },
    isEnabled: !!orderId,
  });
  console.log("data", data);
  const order: RentalOrderDetail | undefined = data?.result;

  const handlePrint = () => {
    const printContent = document.getElementById("print-content");
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore original state
    }
  };

  // Company information
  const companyInfo = {
    name: "Tomthin Intertech Private Limited",
    address: "123 Business Street, Industrial Area, City - 123456",
    phone: "+91 9876543210",
    email: "info@tomthinintertech.com",
  };

  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="order-view-modal" aria-describedby="order-details-view">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 800 },
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            outline: "none",
          }}
          component={Paper}
        >
          {/* ---------- Sticky Header with Close & Print ---------- */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              bgcolor: "background.paper",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h5" component="h2">
              Rental Order Details
            </Typography>

            <Box>
              <Button variant="contained" color="primary" size="small" onClick={handlePrint} sx={{ mr: 1 }} disabled={isLoading}>
                Print
              </Button>

              <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[600] }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* ---------- Body ---------- */}
          <Stack spacing={3} p={4}>
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  Loading order details...
                </Typography>
              </Box>
            ) : isFetched && order ? (
              <>
                {/* Basic Order Information */}
                <Stack spacing={2}>
                  <Typography variant="h6" color="primary">
                    Order Information
                  </Typography>
                  <DetailRow label="Order ID" value={order?.order_id?.toString()} />
                  <DetailRow label="User ID" value={order?.user_id?.toString()} />

                  <Divider />

                  <Typography variant="h6" color="primary">
                    Rental Details
                  </Typography>
                  <DetailRow label="Rental Title" value={order?.rental_title} />
                  <DetailRow label="Rental ID" value={order?.rental_id?.toString()} />
                  <DetailRow label="Rental Rate ID" value={order?.rental_rate_id?.toString()} />
                  <DetailRow label="Period" value={order?.period} />
                  <DetailRow label="Rate" value={`₹${order?.rate}`} />

                  <Divider />

                  <Typography variant="h6" color="primary">
                    Category Info
                  </Typography>
                  <DetailRow label="Category ID" value={order?.category_id?.toString()} />
                  <DetailRow label="Category Name" value={order?.category_name} />

                  <Divider />

                  <Typography variant="h6" color="primary">
                    Payment Info
                  </Typography>
                  <DetailRow label="Total Amount" value={`₹${order?.total_amount}`} />
                  <DetailRow label="Discount Amount" value={`₹${order?.discount_amount}`} />
                  <DetailRow label="Final Amount" value={`₹${order?.final_amount}`} />

                  <StatusRow label="Payment Status" status={order?.payment_status.toUpperCase()} success="success" warning="pending" error="failed" />

                  <StatusRow label="Order Status" status={order?.order_status.toUpperCase()} success="completed" warning="pending" info="confirmed" />

                  <Divider />

                  <Typography variant="h6" color="primary">
                    Address Info
                  </Typography>
                  <DetailRow label="Full Name" value={order?.full_name} />
                  <DetailRow label="Mobile" value={order?.mobile} />
                  <DetailRow label="Alternate Mobile" value={order?.alternate_mobile} />
                  <DetailRow label="Address" value={order?.address} />
                  <DetailRow label="Locality" value={order?.locality} />
                  <DetailRow label="Landmark" value={order?.landmark} />
                  <DetailRow label="Pincode" value={order?.pincode} />
                  <DetailRow label="Address Type" value={order?.address_type.toUpperCase()} />
                  <DetailRow label="Default Address" value={order?.is_default ? "Yes" : "No"} />

                  <Divider />

                  <Typography variant="h6" color="primary">
                    Timestamps
                  </Typography>
                  <DetailRow label="Created On" value={order?.created_on ? dayjs(order?.created_on).format("DD/MM/YYYY") : "N/A"} />
                  {/* <DetailRow label="Updated On" value={order?.updated_on ? new Date(order?.updated_on).toLocaleString() : "N/A"} /> */}
                </Stack>
              </>
            ) : (
              <Typography align="center" color="error">
                {isFetched ? "No order details found." : "Failed to load order details."}
              </Typography>
            )}
          </Stack>
        </Box>
      </Modal>

      <div id="print-content" style={{ display: "none" }}>
        <div className="bg-gray-200 min-h-screen flex items-center justify-center p-4">
          <div className="bg-white w-[210mm] min-h-[297mm] shadow-md rounded p-8 text-[11px] font-sans text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <img src="http://vergo-kertas.herokuapp.com/assets/img/logo.png" alt="Logo" className="h-10 mb-2" />
                <div className="text-[11px]">
                  <strong>{companyInfo.name}</strong>
                  <br />
                  {companyInfo.address}
                  <br />
                  Phone: {companyInfo.phone} | Email: {companyInfo.email}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-[14px] leading-tight font-semibold">
                  RENTAL ORDER RECEIPT
                  <br />
                  <span className="font-light text-[11px] text-gray-600">Order #{order?.order_id}</span>
                </h2>
                <span className="text-gray-600 text-[11px]">Date: {dayjs().format("DD/MM/YYYY HH:mm")}</span>
              </div>
            </div>

            <hr className="border-t border-gray-300 my-4" />

            {/* Customer & Rental Info */}
            <div className="flex flex-wrap justify-between mb-4 gap-4">
              <div className="w-[48%] border border-gray-300 rounded p-3">
                <strong className="text-[12px] block mb-1">Customer Info:</strong>
                {order?.full_name}
                <br />
                {order?.address}
                <br />
                {order?.locality}, {order?.landmark}, {order?.pincode}
                <br />
                Mobile: {order?.mobile}
                <br />
                Alternate: {order?.alternate_mobile}
              </div>
              <div className="w-[48%] border border-gray-300 rounded p-3">
                <strong className="text-[12px] block mb-1">Rental Details:</strong>
                {order?.rental_title} ({order?.category_name})
                <br />
                Period: {order?.period}
                <br />
                Rate: ₹{order?.rate}
                <br />
                Total Amount: ₹{order?.total_amount}
                <br />
                Discount: ₹{order?.discount_amount}
                <br />
                <span className="font-bold border-dashed border p-1 block mt-1">Final Amount: ₹{order?.final_amount}</span>
                <br />
                <span>
                  Payment Status:{" "}
                  <span className={`px-2 py-1 rounded text-white ${order?.payment_status === "success" ? "bg-green-600" : order?.payment_status === "pending" ? "bg-yellow-500" : "bg-red-600"}`}>
                    {(order?.payment_status ?? "unknown").charAt(0).toUpperCase() + (order?.payment_status ?? "unknown").slice(1)}
                  </span>
                </span>
                <br />
                <span>
                  Order Status:{" "}
                  <span className={`px-2 py-1 rounded text-white ${order?.order_status === "completed" ? "bg-green-600" : order?.order_status === "confirmed" ? "bg-blue-600" : "bg-yellow-500"}`}>
                    {(order?.order_status ?? "unknown").charAt(0).toUpperCase() + (order?.order_status ?? "unknown").slice(1)}
                  </span>
                </span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="border border-gray-300 rounded p-4 mb-4">
              <strong className="text-[12px] block mb-1">Timestamps:</strong>
              Created On: {dayjs(order?.created_on).format("DD/MM/YYYY")}
              <br />
              Updated On: {dayjs(order?.updated_on).format("DD/MM/YYYY")}
            </div>

            {/* Footer */}
            <div className="mt-6 text-right text-[11px]">This is a computer-generated receipt. No signature required.</div>
          </div>
        </div>
      </div>
    </>
  );
};

// ---------- Helper Components ----------

interface DetailRowProps {
  label: string;
  value?: string | null;
}
const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <Box display="flex" justifyContent="space-between">
    <Typography variant="body2" color="text.secondary" fontWeight="medium">
      {label}:
    </Typography>
    <Typography variant="body2" fontWeight="regular">
      {value || "N/A"}
    </Typography>
  </Box>
);

interface StatusRowProps {
  label: string;
  status: string;
  success: string;
  warning: string;
  error?: string;
  info?: string;
}
const StatusRow: React.FC<StatusRowProps> = ({ label, status, success, warning, error, info }) => {
  const getColor = () => {
    if (status === success) return "success";
    if (status === warning) return "warning";
    if (status === error) return "error";
    if (status === info) return "info";
    return "default";
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary" fontWeight="medium">
        {label}:
      </Typography>
      <Chip label={status?.charAt(0).toUpperCase() + status?.slice(1)} color={getColor() as any} size="small" variant="outlined" />
    </Box>
  );
};

export default ViewRentalOrder;
