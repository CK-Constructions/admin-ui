import { useState } from "react";
import {
    Container,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    Tabs,
    Tab,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    Grid,
} from "@mui/material";
import { Search, GridView, List } from "@mui/icons-material";

const categories = ["All Categories", "Electronics", "Clothing", "Home & Garden", "Toys & Games"];
const sortOptions = ["Newest First", "Oldest First", "Price: High to Low", "Price: Low to High"];

const Listings = () => {
    const [view, setView] = useState("grid");
    const [category, setCategory] = useState("All Categories");
    const [sortBy, setSortBy] = useState("Newest First");

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
                Listings
            </Typography>

            <Button variant="outlined">Add Listing</Button>

            <Grid container spacing={2} sx={{ mt: 2 }} alignItems="center">
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        placeholder="Search listings..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <Select fullWidth value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={6} md={2}>
                    <Select fullWidth value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        {sortOptions.map((sort) => (
                            <MenuItem key={sort} value={sort}>
                                {sort}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            </Grid>

            <Tabs value={view} onChange={(_, newValue) => setView(newValue)} sx={{ mt: 3 }}>
                <Tab icon={<GridView />} label="Grid" value="grid" />
                <Tab icon={<List />} label="List" value="list" />
            </Tabs>

            {view === "grid" ? (
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Product {i + 1}</Typography>
                                    <Typography variant="body2">Category {(i % 4) + 1}</Typography>
                                    <Typography variant="h6">${(19.99 + i * 10).toFixed(2)}</Typography>
                                    <Button variant="outlined">View</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <TableContainer sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>Product {i + 1}</TableCell>
                                    <TableCell>Category {(i % 4) + 1}</TableCell>
                                    <TableCell>${(19.99 + i * 10).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" sx={{ mr: 1 }}>
                                            Edit
                                        </Button>
                                        <Button variant="outlined">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Pagination count={3} sx={{ mt: 4, display: "flex", justifyContent: "center" }} />
        </Container>
    );
};

export default Listings;
