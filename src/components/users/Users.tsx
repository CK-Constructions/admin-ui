import { useState } from "react";
import {
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Pagination,
} from "@mui/material";
import { Search, Edit, Visibility } from "@mui/icons-material";

export default function Users() {
    const [page, setPage] = useState<number>(1);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <div className="flex flex-col h-full bg-white p-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-2xl font-semibold text-[#171717]">Users</h1>
                <Button variant="outlined">Add User</Button>
            </div>
            <div className="my-6 flex justify-between items-center">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <TextField fullWidth placeholder="Search users..." variant="outlined" size="small" />
                </div>
                <div className="flex gap-2">
                    <Button variant="outlined">Filter</Button>
                    <Button variant="outlined">Export</Button>
                </div>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>John Doe {i + 1}</TableCell>
                                <TableCell>john.doe{i + 1}@example.com</TableCell>
                                <TableCell>{i % 2 === 0 ? "Admin" : "User"}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                            i % 3 === 0 ? "text-green-800" : i % 3 === 1 ? "text-yellow-800" : "text-red-800"
                                        }`}
                                    >
                                        {i % 3 === 0 ? "Active" : i % 3 === 1 ? "Pending" : "Inactive"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small">
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small">
                                        <Visibility fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="flex justify-center mt-6">
                <Pagination count={3} page={page} onChange={handlePageChange} color="primary" />
            </div>
        </div>
    );
}
