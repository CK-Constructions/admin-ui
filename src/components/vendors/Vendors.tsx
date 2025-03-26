import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    Select,
    MenuItem,
    Pagination,
} from "@mui/material";
import { Search, Download, Filter, Star } from "@mui/icons-material";

interface SellerData {
    name: string;
    products: number;
    revenue: number;
    rating: number;
    status: "Active" | "New" | "Featured";
}

const sellers: SellerData[] = [
    { name: "Seller 1", products: 22, revenue: 15000, rating: 5.0, status: "Active" },
    { name: "Seller 2", products: 19, revenue: 13000, rating: 4.5, status: "New" },
    { name: "Seller 3", products: 16, revenue: 11000, rating: 5.0, status: "Featured" },
    { name: "Seller 4", products: 13, revenue: 9000, rating: 4.5, status: "Active" },
    { name: "Seller 5", products: 10, revenue: 7000, rating: 5.0, status: "New" },
];

export default function Vendors() {
    const [statusFilter, setStatusFilter] = useState("all");

    return (
        <Box display="flex" flexDirection="column" height="100%" bgcolor="white" p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Sellers</Typography>
                <Box display="flex" gap={2}>
                    <Button variant="outlined">Add Seller</Button>
                    <Button variant="outlined" startIcon={<Download />}>
                        Export
                    </Button>
                </Box>
            </Box>

            <Box display="flex" gap={3} mb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography color="textSecondary">Total Sellers</Typography>
                        <Typography variant="h5">1,245</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <Typography color="textSecondary">Active Sellers</Typography>
                        <Typography variant="h5">876</Typography>
                    </CardContent>
                </Card>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <TextField
                    variant="outlined"
                    placeholder="Search sellers..."
                    InputProps={{ startAdornment: <Search fontSize="small" /> }}
                />
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="new">New</MenuItem>
                </Select>
                <Button variant="outlined" startIcon={<Filter />}>
                    Filter
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Seller</TableCell>
                            <TableCell>Products</TableCell>
                            <TableCell>Revenue</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sellers.map((seller, index) => (
                            <TableRow key={index}>
                                <TableCell>{seller.name}</TableCell>
                                <TableCell>{seller.products}</TableCell>
                                <TableCell>${seller.revenue.toLocaleString()}</TableCell>
                                <TableCell>
                                    {seller.rating} <Star fontSize="small" color="primary" />
                                </TableCell>
                                <TableCell>{seller.status}</TableCell>
                                <TableCell>
                                    <IconButton size="small">View</IconButton>
                                    <IconButton size="small">Contact</IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination count={3} color="primary" sx={{ mt: 3, alignSelf: "center" }} />
        </Box>
    );
}
