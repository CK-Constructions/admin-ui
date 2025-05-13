"use client";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Divider,
  useTheme,
  Stack,
  Skeleton,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { Visibility as ViewIcon, Block as DisableIcon } from "@mui/icons-material";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { useNavigate } from "react-router";
import { useState } from "react";
import { TListing } from "../lib/types/response";
import { BanListing } from "./BanListing";
import { TQueryParams } from "../lib/types/common";
import Header from "../common/Header";
import { sanitizeValue } from "../utils/utils";
import { countStyle } from "../vendors/Vendors";

const Listings = () => {
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { queryFn: listFunc, queryKey } = queryConfigs.useGetListings;
  const theme = useTheme();
  const [params, setParams] = useState({
    id: "",
    category: "",
    seller: "",
    username: "",
    active: "",
  });

  // Categories data
  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Furniture" },
  ];

  const {
    data: listings,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetQuery({
    func: listFunc,
    key: queryKey,
    params: { ...params },
  });

  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TListing | null>(null);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
  };

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name as keyof TQueryParams]: value,
    }));
  };

  const handleOpenBanDialog = (user: TListing) => {
    setSelectedUser(user);
    setOpenBanDialog(true);
  };

  const handleDetail = (id: number) => {
    navigate(`/listings/${id}`);
  };

  const handleClickBack = () => {
    navigate(-1);
  };

  // Loading state
  if (isLoading || isFetching) {
    return (
      <Box sx={{ p: 3 }}>
        <Header
          showButton={true}
          buttonFunc={() => navigate("/add-listing")}
          onBackClick={handleClickBack}
          onReloadClick={refetch}
          pageName="Listings"
        />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box sx={{ p: 3, textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Header
          showButton={true}
          buttonFunc={() => navigate("/add-listing")}
          onBackClick={handleClickBack}
          onReloadClick={refetch}
          pageName="Listings"
        />
        <Typography variant="h6" color="error" gutterBottom>
          Failed to load listings
        </Typography>
        <Button variant="contained" onClick={() => refetch()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  // Empty state
  if (!listings?.result?.list || listings.result.list.length === 0) {
    return (
      <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Header
          showButton={true}
          buttonFunc={() => navigate("/add-listing")}
          onBackClick={handleClickBack}
          onReloadClick={refetch}
          pageName="Listings"
        />
        <div className="mt-10">
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No listings found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search filters or create a new listing
          </Typography>
        </div>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Header
        showButton={true}
        buttonFunc={() => navigate("/add-listing")}
        onBackClick={handleClickBack}
        onReloadClick={refetch}
        pageName="Listings"
      />

      {/* Filter Controls */}
      <Box sx={{ mb: 3, p: 2, borderRadius: 1, boxShadow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth label="Listing ID" name="id" value={params.id} onChange={handleParamChange} variant="outlined" size="small" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={params.username}
              onChange={handleParamChange}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select name="active" value={params.active} label="Status" onChange={handleParamChange}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="1">Active</MenuItem>
                <MenuItem value="0">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select name="category" value={params.category} label="Category" onChange={handleParamChange}>
                <MenuItem value="">All</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Results count and pagination */}
      <div className="flex items-center justify-end my-5">
        <div className="flex items-center justify-end space-x-3">
          {sanitizeValue(listings?.result?.count) > 0 && (
            <Pagination
              count={Math.ceil(sanitizeValue(listings?.result?.count) / limit)}
              size="medium"
              page={currentPage}
              onChange={handlePageChange}
            />
          )}
          <p className="flex items-center space-x-2 font-medium text-slate-700">
            <span>Total result:</span>
            <span className={countStyle}>{sanitizeValue(listings?.result?.count)}</span>
          </p>
        </div>
      </div>

      {/* Listings grid */}
      <Grid container spacing={3}>
        {listings?.result.list.map((listing: TListing) => (
          <Grid item xs={12} sm={6} md={4} key={listing.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box sx={{ position: "relative", pt: "56.25%", bgcolor: theme.palette.grey[100] }}>
                <CardMedia
                  component="img"
                  src={`${process.env.REACT_APP_GET_MEDIA}/${listing.image}`}
                  alt={listing.title}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    p: 1,
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Chip label={listing.category_name} size="small" />
                  <Typography variant="caption" color="text.secondary">
                    Sold by: {listing.seller_name}
                  </Typography>
                </Stack>

                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    minHeight: "3.6rem",
                  }}
                >
                  {listing.title}
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ₹{listing.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {listing.delivery_time} day delivery
                  </Typography>
                </Stack>
              </CardContent>
              <Divider />

              <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Button onClick={() => handleDetail(listing.id)} size="small" color="primary" startIcon={<ViewIcon />} variant="text">
                  View Details
                </Button>
                {listing.is_active === 0 ? (
                  <Button onClick={() => handleOpenBanDialog(listing)} size="small" color="error" startIcon={<DisableIcon />} variant="text">
                    Disable
                  </Button>
                ) : (
                  <Button onClick={() => handleOpenBanDialog(listing)} size="small" color="primary" startIcon={<DisableIcon />} variant="text">
                    Enable
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <BanListing
        open={openBanDialog && !!selectedUser}
        onClose={() => setOpenBanDialog(false)}
        isBanned={selectedUser?.is_active === 1 ? true : false}
        user={selectedUser as TListing}
      />
    </Box>
  );
};

export default Listings;
