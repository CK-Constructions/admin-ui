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
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { TQueryParams } from "../lib/types/common";
import { IVendor } from "../lib/types/response";
import { FaBan, FaEye } from "react-icons/fa";
import ViewVendor from "./ViewVendor";
import { BanVendorDialog } from "./BanVendorDialog";
import { sanitizeValue } from "../utils/utils";
import { BsUniversalAccessCircle } from "react-icons/bs";
import Header from "../common/Header";
import { useNavigate } from "react-router";
import Loading from "../common/Loader";

export const countStyle = "flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200";

export default function Vendors() {
  const navigate = useNavigate();
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<IVendor | null>(null);
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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };
  const { queryFn: vendorFunc, queryKey: vendorKey } = queryConfigs.useGetVendors;
  const { data, isLoading, isLoadingError, isFetching, isRefetching, isRefetchError } = useGetQuery({
    func: vendorFunc,
    key: vendorKey,
    params: {
      limit,
      offset: (currentPage - 1) * limit,
      ...searchParams,
    },
  });
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
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
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const handleOpenBanDialog = (user: IVendor) => {
    setSelectedUser(user);
    setOpenBanDialog(true);
  };
  const handleOpenViewDialog = (user: IVendor) => {
    setSelectedUserId(user.id);

    setOpenViewDialog(true);
  };
  const handleCloseBanDialog = () => {
    setOpenBanDialog(false);
  };

  // Loading state
  if (isLoading || isFetching || isRefetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Loading />
      </Box>
    );
  }

  // Error states
  if (isLoadingError || isRefetchError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">Error loading buyers data. Please try again.</Typography>
      </Box>
    );
  }

  // No data state
  if (!data || !data.result || !data.result.list || data.result.list.length === 0) {
    return (
      <Box display="flex" flexDirection="column" height="100%">
        <div className="pb-4">
          <Header onBackClick={() => navigate(-1)} pageName="Buyers" />
        </div>
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
          <Typography>No buyers found</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="pb-4">
        <Header onBackClick={() => navigate(-1)} pageName="Vendors" />
      </div>

      <>
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
      </>

      <TableContainer sx={{ maxHeight: 540, scrollbarWidth: 0 }} component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead sx={{ backgroundColor: "black" }}>
            {" "}
            {}
            <TableRow>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>ID</TableCell>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>Name</TableCell>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>Username</TableCell>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>Mobile</TableCell>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>Email</TableCell>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>Verified</TableCell>
              <TableCell sx={{ color: "white", backgroundColor: "black" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.result.list.map((vendor: IVendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.id}</TableCell>
                <TableCell>{vendor.fullname}</TableCell>
                <TableCell>{vendor.username}</TableCell>
                <TableCell>{vendor.mobile}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>
                  <Chip
                    label={vendor.verified ? "Verified" : "Pending"}
                    color={vendor.verified ? "success" : "error"}
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
                <TableCell>
                  <section className="w-full flex gap-2">
                    {/* <Tooltip title="Edit">
                      <button className="flex items-center justify-center p-2 text-neutral-700   rounded-md hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-sm hover:shadow-md w-8 h-8">
                        <FaEdit size={14} />
                      </button>
                    </Tooltip> */}
                    <Tooltip title="View">
                      <button onClick={() => handleOpenViewDialog(vendor)} className="action-button">
                        <FaEye size={14} />
                      </button>
                    </Tooltip>
                    {vendor.is_active === 0 && (
                      <Tooltip title="Ban Vendor">
                        <button onClick={() => handleOpenBanDialog(vendor)} className="red-action-button">
                          <FaBan size={14} />
                        </button>
                      </Tooltip>
                    )}
                    {vendor.is_active === 1 && (
                      <Tooltip title="Unban Vendor">
                        <button onClick={() => handleOpenBanDialog(vendor)} className="green-action-button">
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
      <BanVendorDialog
        open={openBanDialog && !!selectedUser}
        onClose={() => setOpenBanDialog(false)}
        isBanned={selectedUser?.is_active === 1 ? true : false}
        user={selectedUser as IVendor}
      />
      <ViewVendor open={openViewDialog && !!selectedUserId} onClose={() => setOpenViewDialog(false)} vendorId={selectedUserId as number} />
    </div>
  );
}
