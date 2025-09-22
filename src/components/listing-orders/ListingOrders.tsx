import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Pagination,
	Chip,
	Box,
	Typography,
	Tooltip,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@mui/material';
import { FaEye, FaPrint } from 'react-icons/fa'; // ✅ Added printer icon
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery } from '../../query/hooks/queryHook';
import { Order, OrderItem } from '../lib/types/response';
import Header from '../common/Header';
import { useNavigate } from 'react-router';
import Loading from '../common/Loader';

export const countStyle = 'flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200';

export default function ListingOrders() {
	const navigate = useNavigate();
	const limit = 10;
	const [currentPage, setCurrentPage] = useState(1);

	const [openViewDialog, setOpenViewDialog] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	const { queryFn: orderFunc, queryKeys: orderKey } = queryConfigs.useGetAllOrders;

	const { data, isLoading, isLoadingError, isFetching, isRefetching, isRefetchError } = useGetQuery({
		func: orderFunc,
		key: orderKey,
		params: {
			limit,
			offset: (currentPage - 1) * limit,
		},
	});

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		event.preventDefault();
		setCurrentPage(value);
	};

	const handleOpenViewDialog = (order: Order) => {
		setSelectedOrder(order);
		setOpenViewDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenViewDialog(false);
		setSelectedOrder(null);
	};

	// ✅ Helper to print the invoice of a single order
	const handlePrintInvoice = (order: Order) => {
		const invoiceWindow = window.open('', '_blank');
		if (!invoiceWindow) return;

		const itemsHtml = order.items
			.map(
				(item) => `
			<tr>
				<td>${item.product_name}</td>
				<td>${item.category_name}</td>
				<td>${item.quantity}</td>
				<td>₹${item.unit_price}</td>
				<td>₹${item.total_price}</td>
			</tr>`
			)
			.join('');

		invoiceWindow.document.write(`
			<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order Invoice - ${order.id}</title>
  <style>
    /* ---------- Global ---------- */
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      padding: 40px;
      background: #f9fafb;
      color: #1f2937;
    }
    h1, h3 {
      text-align: center;
      margin: 0;
    }
    h1 {
      font-size: 28px;
      letter-spacing: 1px;
      color: #111827;
      margin-bottom: 8px;
    }
    h3 {
      margin-top: 40px;
      font-size: 20px;
      color: #374151;
    }

    /* ---------- Invoice Card ---------- */
    .invoice-container {
      max-width: 800px;
      margin: auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      padding: 40px;
    }

    /* ---------- Details Section ---------- */
    .details {
      margin-top: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      font-size: 15px;
      line-height: 1.6;
    }
    .details p {
      margin: 0;
    }
    .details strong {
      color: #111827;
    }

    /* ---------- Table ---------- */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 15px;
    }
    th, td {
      padding: 12px 10px;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
    }
    th {
      background: #f3f4f6;
      color: #111827;
      font-weight: 600;
    }
    tbody tr:hover {
      background: #f9fafb;
    }

    /* ---------- Print ---------- */
    @media print {
      body { background: #fff; }
      .invoice-container {
        box-shadow: none;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <h1>TOMTHIN - Order Invoice</h1>

    <div class="details">
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Total Amount:</strong> ₹${order.total_amount}</p>
      <p><strong>Final Amount:</strong> ₹${order.final_amount}</p>
      <p><strong>Payment Status:</strong> ${order.payment_status}</p>
      <p><strong>Order Status:</strong> ${order.order_status}</p>
      <p><strong>Created On:</strong> ${new Date(order.created_on).toLocaleString()}</p>
    </div>

    <h3>Items</h3>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
  </div>

  <script>
    window.print();
  </script>
</body>
</html>

		`);

		invoiceWindow.document.close();
	};

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
				<Typography color="error">Error loading orders. Please try again.</Typography>
			</Box>
		);
	}

	if (!data || !data.result || data.result.length === 0) {
		return (
			<Box display="flex" flexDirection="column" height="100%">
				<div className="pb-4">
					{/* ✅ Header name changed to TOMTHIN */}
					<Header onBackClick={() => navigate(-1)} pageName="Listing-Order" />
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
				{/* ✅ Header name changed to TOMTHIN */}
				<Header onBackClick={() => navigate(-1)} pageName="TOMTHIN" />
			</div>

			<TableContainer sx={{ maxHeight: 540, scrollbarWidth: 0 }} component={Paper}>
				<Table stickyHeader aria-label="orders table">
					<TableHead>
						<TableRow>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Order ID</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Total Amount</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Final Amount</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Payment Status</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Order Status</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Items Count</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Created On</TableCell>
							<TableCell sx={{ color: 'white', backgroundColor: 'black' }}>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.result.map((order: Order) => (
							<TableRow key={order.id}>
								<TableCell>{order.id}</TableCell>
								<TableCell>₹{order.total_amount}</TableCell>
								<TableCell>₹{order.final_amount}</TableCell>
								<TableCell>
									<Chip
										label={order.payment_status}
										color={order.payment_status === 'success' ? 'success' : order.payment_status === 'pending' ? 'warning' : 'error'}
										size="small"
										variant="outlined"
									/>
								</TableCell>
								<TableCell>
									<Chip
										label={order.order_status}
										color={order.order_status === 'completed' ? 'success' : order.order_status === 'pending' ? 'warning' : 'info'}
										size="small"
										variant="outlined"
									/>
								</TableCell>
								<TableCell>{order.items.length}</TableCell>
								<TableCell>{new Date(order.created_on).toLocaleString()}</TableCell>
								<TableCell>
									<div style={{ display: 'flex', gap: '8px' }}>
										<Tooltip title="View Order">
											<IconButton onClick={() => handleOpenViewDialog(order)} size="small">
												<FaEye />
											</IconButton>
										</Tooltip>
										{/* ✅ New Print button */}
										<Tooltip title="Print Invoice">
											<IconButton onClick={() => handlePrintInvoice(order)} size="small">
												<FaPrint />
											</IconButton>
										</Tooltip>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<div className="flex items-center justify-center mt-5">
				<div className="flex items-center justify-end space-x-3">
					{data?.result.length > 0 && (
						<Pagination count={Math.ceil(data.result.length / limit)} size="medium" page={currentPage} onChange={handlePageChange} />
					)}
					<p className="flex items-center space-x-2 font-medium text-slate-700">
						<span>Total result:</span>
						<span className={countStyle}>{data?.result.length}</span>
					</p>
				</div>
			</div>

			{/* ====== View Order Dialog ====== */}
			<Dialog open={openViewDialog && !!selectedOrder} onClose={handleCloseDialog} maxWidth="md" fullWidth>
				<DialogTitle>Order Details</DialogTitle>
				<DialogContent dividers>
					{selectedOrder && (
						<>
							<Typography variant="subtitle1" gutterBottom>
								<strong>Order ID:</strong> {selectedOrder.id}
							</Typography>
							<Typography variant="subtitle1" gutterBottom>
								<strong>Total Amount:</strong> ₹{selectedOrder.total_amount} |<strong> Final Amount:</strong> ₹{selectedOrder.final_amount}
							</Typography>
							<Typography variant="subtitle1" gutterBottom>
								<strong>Payment Status:</strong> {selectedOrder.payment_status} |<strong> Order Status:</strong> {selectedOrder.order_status}
							</Typography>
							<Typography variant="subtitle1" gutterBottom>
								<strong>Created On:</strong> {new Date(selectedOrder.created_on).toLocaleString()}
							</Typography>

							<Box mt={3}>
								<Typography variant="h6" gutterBottom>
									Items
								</Typography>
								<TableContainer component={Paper}>
									<Table size="small" aria-label="order items">
										<TableHead>
											<TableRow>
												<TableCell>Product</TableCell>
												<TableCell>Category</TableCell>
												<TableCell>Quantity</TableCell>
												<TableCell>Unit Price</TableCell>
												<TableCell>Total Price</TableCell>
												<TableCell>Estimated Delivery (days)</TableCell>
												<TableCell>Order Date</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{selectedOrder.items.map((item: OrderItem) => (
												<TableRow key={item.order_item_id}>
													<TableCell>{item.product_name}</TableCell>
													<TableCell>{item.category_name}</TableCell>
													<TableCell>{item.quantity}</TableCell>
													<TableCell>₹{item.unit_price}</TableCell>
													<TableCell>₹{item.total_price}</TableCell>
													<TableCell>{item.estimated_delivery_days}</TableCell>
													<TableCell>{new Date(item.order_date).toLocaleDateString()}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</Box>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} variant="contained">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
