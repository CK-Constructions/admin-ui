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
  Pagination,
  Chip,
  Tooltip,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { TQueryParams } from "../lib/types/common";
import { TRentalItem } from "../lib/types/response";
import { FaBan, FaEdit, FaEye } from "react-icons/fa";
import { BsUniversalAccessCircle } from "react-icons/bs";
import { sanitizeValue } from "../utils/utils";
import { countStyle } from "../vendors/Vendors";

import { TUserFormData } from "../lib/types/payloads";

import { useNavigate } from "react-router";
import Header from "../common/Header";

export default function Rentals() {
  const navigate = useNavigate();

  // State variables
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TRentalItem | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [params, setParams] = useState<TQueryParams>({
    email: "",
    username: "",
    mobile: "",
  });
  const [searchParams, setSearchParams] = useState<TQueryParams>({
    email: "",
    username: "",
    mobile: "",
  });
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // Query and data fetching
  const limit = 10;
  const { queryFn: rentalFunc, queryKeys: rentalKey } = queryConfigs.useGetAllRentals;
  const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
    func: rentalFunc,
    key: rentalKey,
    params: {
      offset: (currentPage - 1) * limit,
      limit,
      ...searchParams,
    },
  });

  // Search and filtering functions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };
  const handleSearch = () => {
    setSearchParams(params);
  };
  const handleClear = () => {
    setParams({
      email: "",
      username: "",
      mobile: "",
    });
    setSearchParams({
      email: "",
      username: "",
      mobile: "",
    });
  };

  // Pagination functions
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
  };

  // Dialog and modal functions
  const handleOpenEdit = (rental: TRentalItem) => {
    setEditingUserId(rental?.id);
    setOpenBanDialog(true);
  };
  const handleOpenBanDialog = (rental: TRentalItem) => {
    setSelectedUser(rental);
    setOpenBanDialog(true);
  };
  const handleOpenViewDialog = (rental: TRentalItem) => {
    setSelectedUserId(rental?.id);
    setOpenViewDialog(true);
  };

  // Form submission and navigation functions
  const handleSubmit = (userData: TUserFormData) => {
    // Here you would typically send the data to your API
  };
  const handleClickBack = () => {
    navigate(-1);
  };

  const handleNavToView = (id: number) => {
    if (id) {
      navigate(`/rentals/${id}`);
    }
  };

  // Loading and error states
  if (isLoading || isRefetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">Error loading users. Please try again.</Typography>
      </Box>
    );
  }

  if (!data?.result?.list || data.result.list.length === 0) {
    return (
      <>
        <div className="pb-4">
          <Header
            onBackClick={handleClickBack}
            onReloadClick={refetch}
            showButton={true}
            buttonTitle="Add Vehicle Rental"
            pageName="Users"
            buttonFunc={() => setIsModalOpen(true)}
          />
        </div>

        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Vehicle Rental found
          </Typography>
          <Button variant="contained" onClick={() => setIsModalOpen(true)}>
            Add New Vehicle Rental
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <div className="pb-4">
        <Header
          onBackClick={handleClickBack}
          onReloadClick={refetch}
          showButton={false}
          buttonTitle="Add Vehicle Rental"
          pageName="Vehicle Rentals"
          buttonFunc={() => setIsModalOpen(true)}
        />
      </div>

      <div className="flex flex-col h-full p-6">
        <div className="my-6 flex gap-2">
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            size="small"
            value={params.email}
            onChange={handleSearchChange}
            sx={{
              width: "20%",
            }}
          />
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            size="small"
            value={params.username}
            onChange={handleSearchChange}
            sx={{
              width: "20%",
            }}
          />
          <TextField
            name="mobile"
            label="Mobile"
            variant="outlined"
            size="small"
            value={params.mobile}
            onChange={handleSearchChange}
            sx={{
              width: "20%",
            }}
          />
          <div className="flex space-x-2 items-center">
            <Button variant="outlined" onClick={handleSearch}>
              Search
            </Button>
            <Button variant="outlined" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "black" }}>
                <TableCell sx={{ color: "white" }}>ID</TableCell>
                <TableCell sx={{ color: "white" }}>Rental Title</TableCell>
                <TableCell sx={{ color: "white" }}>Category</TableCell>

                <TableCell sx={{ color: "white" }}>Insurance Required</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }}>Seller</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.result.list.map((rental: TRentalItem) => (
                <TableRow key={rental?.id}>
                  <TableCell>{rental?.id}</TableCell>
                  <TableCell>{rental?.name}</TableCell>
                  <TableCell>{rental?.category_name}</TableCell>

                  <TableCell align="center">{rental?.insurance_required ? "No" : "Yes"}</TableCell>

                  <TableCell>
                    <Chip
                      label={rental?.is_active === 0 ? "Active" : "Disabled"}
                      color={rental?.is_active === 0 ? "success" : "error"}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 500,
                        borderWidth: 1.5,
                        "& .MuiChip-label": {
                          px: 0.75,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>{rental?.seller_fullname}</TableCell>
                  <TableCell>
                    <section className="w-full flex gap-2">
                      <Tooltip title="View">
                        <button onClick={() => handleNavToView(rental.id)} className="action-button">
                          <FaEye size={14} />
                        </button>
                      </Tooltip>
                      {rental?.is_active === 0 && (
                        <Tooltip title="Ban Vehicle Rental">
                          <button onClick={() => handleOpenBanDialog(rental)} className="red-action-button">
                            <FaBan size={14} />
                          </button>
                        </Tooltip>
                      )}
                      {rental?.is_active === 1 && (
                        <Tooltip title="UnBan Vehicle Rental">
                          <button onClick={() => handleOpenBanDialog(rental)} className="green-action-button">
                            <BsUniversalAccessCircle size={14} />
                          </button>
                        </Tooltip>
                      )}
                    </section>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex items-center justify-center mt-5">
          <div className="flex items-center justify-end space-x-3">
            {sanitizeValue(data?.result?.count) > 0 && (
              <Pagination count={Math.ceil(sanitizeValue(data?.result?.count) / limit)} size="medium" page={currentPage} onChange={handlePageChange} />
            )}
            <p className="flex items-center space-x-2 font-medium text-slate-700">
              <span>Total result:</span>
              <span className={countStyle}>{sanitizeValue(data?.result?.count)}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
