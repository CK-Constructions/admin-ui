"use client";
import { Box, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, Chip, Divider, useTheme, Stack, Skeleton } from "@mui/material";
import { Visibility as ViewIcon, Block as DisableIcon } from "@mui/icons-material";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { useNavigate } from "react-router";
import { useState } from "react";
import { TListing } from "../lib/types/response";
import { BanListing } from "./BanListing";
import { TQueryParams } from "../lib/types/common";
import Header from "../common/Header";

const Listings = () => {
  const navigate = useNavigate();
  const { queryFn: listFunc, queryKey } = queryConfigs.useGetListings;
  const theme = useTheme();
  const [params, setParams] = useState<TQueryParams>({
    id: "",
    category: "",
    seller: "",
    active: "",
  });

  const { data: listings, isLoading } = useGetQuery({
    func: listFunc,
    key: queryKey,
    params: { ...params },
  });
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TListing | null>(null);

  const handleOpenBanDialog = (user: TListing) => {
    setSelectedUser(user);
    setOpenBanDialog(true);
  };

  const handleDetail = (id: number) => {
    navigate(`/listings/${id}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
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

  return (
    <Box sx={{ p: 1 }}>
      <Header showButton={true} buttonFunc={() => navigate("/add-listing")} />
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        {/* <Chip label={`${listings?.result?.count} items`} color="primary" size="small" /> */}
      </Stack>

      <Grid container spacing={3}>
        {listings?.result.list.map((listing: any) => (
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
              {/* Listing Image - Reduced size with better styling */}
              <Box sx={{ position: "relative", pt: "56.25%", bgcolor: theme.palette.grey[100] }}>
                <CardMedia
                  component="img"
                  src={listing.image}
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
                {/* Category and Seller */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Chip label={listing.category_name} size="small" />
                  <Typography variant="caption" color="text.secondary">
                    Sold by: {listing.seller_name}
                  </Typography>
                </Stack>

                {/* Title */}
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

                {/* Price and Delivery */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ₹{listing.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {listing.delivery_time} day delivery
                  </Typography>
                </Stack>

                {/* Description (truncated) */}
                {/* <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "4.5rem",
                  }}
                >
                  {listing.description}
                </Typography> */}
              </CardContent>

              <Divider />

              {/* Action Buttons */}
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
