"use client";

import type React from "react";
import { Box, Typography, Grid, Paper, Divider, Card, useTheme, useMediaQuery, CircularProgress, Stack, Chip } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { TAttribute } from "../lib/types/response";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { useNavigate, useParams } from "react-router";
import { useMemo, useState } from "react";
import Header from "../common/Header";

const ListingDetailPage = () => {
  const navigate = useNavigate();
  const pathParams = useParams();
  const { queryFn: listFunc, queryKey } = queryConfigs.useGetListingByID;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const listingId = useMemo(() => {
    if (!pathParams.id) return undefined;
    const id = Number.parseInt(pathParams.id);
    return isNaN(id) ? null : id;
  }, [pathParams.id]);

  const {
    data: listingData,
    isLoading,
    isError,
    error,
  } = useGetQuery({
    func: listFunc,
    key: queryKey,
    params: {
      id: listingId ?? null,
    },
    isEnabled: listingId ? true : false,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading product details...
        </Typography>
      </Box>
    );
  }

  if (isError || (!isLoading && !listingData?.result)) {
    console.error("Error loading data:", error);
    return (
      <Box sx={{ p: 3, textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          Error loading listing details
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Please try again later
        </Typography>
      </Box>
    );
  }

  const result = listingData?.result ?? { images: [] };
  const sortedImages = [...result.images].sort((a, b) => b.is_primary - a.is_primary);

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
      <Header onBackClick={() => navigate(-1)} pageName="Listing Info" />
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={4}>
          {/* Image Gallery */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: 2,
              }}
            >
              {/* Fixed Swiper implementation */}
              {sortedImages && sortedImages.length > 0 ? (
                <Box
                  sx={{
                    height: isMobile ? 300 : 400,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    loop={sortedImages.length > 1}
                    pagination={{ clickable: true }}
                    spaceBetween={0}
                    slidesPerView={1}
                    style={
                      {
                        height: "100%",
                        width: "100%",
                        "--swiper-navigation-color": theme.palette.primary.main,
                        "--swiper-pagination-color": theme.palette.primary.main,
                      } as React.CSSProperties
                    }
                  >
                    {sortedImages.map((img) => (
                      <SwiperSlide key={img.id}>
                        <Box
                          sx={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: theme.palette.grey[100],
                            padding: 2,
                          }}
                        >
                          <Box
                            component="img"
                            src={img.image || ""}
                            alt={`Product image ${img.id}`}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/400x400?text=Image+Not+Available";
                              target.onerror = null; // Prevent infinite loop
                            }}
                            sx={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              objectFit: "contain",
                              display: "block",
                            }}
                          />
                        </Box>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              ) : (
                <Box
                  sx={{
                    height: isMobile ? 300 : 400,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.palette.grey[100],
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No images available
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                <Chip label={result.category_name} color="primary" size="small" sx={{ mb: 1 }} />
                <Typography variant="h4" component="h1" gutterBottom>
                  {result.title}
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
                  ₹{result.price.toFixed(2)}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                {result.description}
              </Typography>

              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Delivery Information
                </Typography>
                <Typography variant="body1">
                  Delivery in{" "}
                  <Box component="span" fontWeight="bold">
                    {result.delivery_time}
                  </Box>{" "}
                  business days
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Seller Information
                </Typography>
                <Typography variant="body1">{result.seller_name || "Unknown Seller"}</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Specifications */}
      {result.attributes && result.attributes.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Specifications
          </Typography>
          <Grid container spacing={2}>
            {result.attributes.map((attr: TAttribute) => (
              <Grid item xs={12} sm={6} key={attr.id}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Typography variant="body1" fontWeight="medium">
                    {attr.attribute_name}:
                  </Typography>
                  <Typography variant="body1">{attr.attribute_value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default ListingDetailPage;
