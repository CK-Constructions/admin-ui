import { useState } from "react";
import {
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
    Pagination,
    Select,
    MenuItem,
    TextField,
    InputAdornment,
} from "@mui/material";
import { Search, Download, PersonAdd } from "@mui/icons-material";

interface Buyer {
    name: string;
    email: string;
    purchases: number;
    totalSpent: number;
    lastPurchase: string;
    status: "Active" | "New" | "Returning";
}

const buyers: Buyer[] = Array.from({ length: 5 }).map((_, i) => ({
    name: `Jane Smith ${i + 1}`,
    email: `jane.smith${i + 1}@example.com`,
    purchases: 12 - i,
    totalSpent: 1200 - i * 150,
    lastPurchase: ["Today", "Yesterday", "3 days ago", "1 week ago", "2 weeks ago"][i],
    status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "New" : "Returning",
}));

export default function Buyer() {
    const [page, setPage] = useState<number>(1);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    return (
        <div className="flex flex-col h-full bg-white p-6">
            <div className="flex items-center justify-between border-b pb-4">
                <Typography variant="h4">Buyers</Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" startIcon={<PersonAdd />}>
                        Add Buyer
                    </Button>
                    <Button variant="outlined" startIcon={<Download />}>
                        Export
                    </Button>
                </div>
            </div>

            <div className="my-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <TextField
                    variant="outlined"
                    placeholder="Search buyers..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="new">New</MenuItem>
                </Select>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Purchases</TableCell>
                            <TableCell>Total Spent</TableCell>
                            <TableCell>Last Purchase</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {buyers.map((buyer, index) => (
                            <TableRow key={index}>
                                <TableCell>{buyer.name}</TableCell>
                                <TableCell>{buyer.email}</TableCell>
                                <TableCell>{buyer.purchases}</TableCell>
                                <TableCell>${buyer.totalSpent.toFixed(2)}</TableCell>
                                <TableCell>{buyer.lastPurchase}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                            buyer.status === "Active"
                                                ? "bg-green-100 text-green-800"
                                                : buyer.status === "New"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-blue-100 text-blue-800"
                                        }`}
                                    >
                                        {buyer.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button size="small" variant="outlined">
                                        View
                                    </Button>
                                    <Button size="small" variant="outlined">
                                        Contact
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="flex justify-center mt-6">
                <Pagination count={3} page={page} onChange={(_, value) => setPage(value)} color="primary" />
            </div>
        </div>
    );
}
