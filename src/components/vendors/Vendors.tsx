import { useState } from "react";
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Chip, Tooltip } from "@mui/material";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { TQueryParams } from "../lib/types/common";
import { IVendor } from "../lib/types/response";
import { FaBan, FaEdit, FaEye } from "react-icons/fa";
import ViewVendor from "./ViewVendor";
import { BanVendorDialog } from "./BanVendorDialog";
import { sanitizeValue } from "../utils/utils";
import { BsUniversalAccessCircle } from "react-icons/bs";

const countStyle = "flex items-center justify-center px-2 py-1 text-lg font-bold text-black rounded-full bg-gray-200";

export default function Vendors() {
  const limit = 10;
  const [selectedUser, setSelectedUser] = useState<IVendor | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  const { data } = useGetQuery({
    func: vendorFunc,
    key: vendorKey,
    params: {
      limit,
      offset: (currentPage - 1) * limit,
      ...searchParams,
    },
  });

  const [page, setPage] = useState<number>(1);
  const totalPages = Math.ceil((data?.result?.count || 0) / limit);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
  };

  const handleSearch = () => {
    setSearchParams(params);
    // If you need to trigger the search immediately:
    // refetch(); // if useGetQuery provides a refetch function
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
    console.log(user);
    setOpenViewDialog(true);
  };

  const handleCloseBanDialog = () => {
    setOpenBanDialog(false);
  };
  return (
    <div className="flex flex-col h-full bg-white p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-semibold text-[#171717]">Vendors</h1>
        {/* <Button variant="outlined">Add User</Button> */}
      </div>

      {/* Search and Filter Section */}
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

      {/* Table Section */}
      <TableContainer sx={{ maxHeight: 540, scrollbarWidth: 0 }} component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead sx={{ backgroundColor: "black" }}>
            {" "}
            {/* Apply background here */}
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
                        px: 0.75, // Adjust label padding if needed
                      },
                    }}
                  />
                </TableCell>

                <TableCell>
                  <section className="w-full flex gap-2">
                    {/* <Tooltip title="Edit">
                      <button className="flex items-center justify-center p-2 text-neutral-700 bg-white rounded-md hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-sm hover:shadow-md w-8 h-8">
                        <FaEdit size={14} />
                      </button>
                    </Tooltip> */}

                    <Tooltip title="View">
                      <button
                        onClick={() => handleOpenViewDialog(vendor)}
                        className="flex items-center justify-center p-2 text-neutral-700 bg-white rounded-md hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-sm hover:shadow-md w-8 h-8"
                      >
                        <FaEye size={14} />
                      </button>
                    </Tooltip>
                    {vendor.is_active === 0 && (
                      <Tooltip title="Ban Vendor">
                        <button
                          onClick={() => handleOpenBanDialog(vendor)}
                          className="flex items-center justify-center p-2 text-red-600 bg-white rounded-md hover:bg-red-50 transition-colors border border-red-200 shadow-sm hover:shadow-md w-8 h-8"
                        >
                          <FaBan size={14} />
                        </button>
                      </Tooltip>
                    )}
                    {vendor.is_active === 1 && (
                      <Tooltip title="Unban Vendor">
                        <button
                          onClick={() => handleOpenBanDialog(vendor)}
                          className="flex items-center justify-center p-2 text-green-600 bg-white rounded-md hover:bg-green-50 transition-colors border border-green-200 shadow-sm hover:shadow-md w-8 h-8"
                        >
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

      {/* Pagination Section */}
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
        open={openBanDialog && !!selectedUser} // Only open if selectedUser exists
        onClose={() => setOpenBanDialog(false)}
        isBanned={selectedUser?.is_active === 1 ? true : false}
        user={selectedUser as IVendor} // Type assertion if you're sure it's not null when open
        onConfirm={(userId) => {
          setOpenBanDialog(false);
        }}
      />

      <ViewVendor
        open={openViewDialog && !!selectedUserId} // Only open if selectedUser exists
        onClose={() => setOpenViewDialog(false)}
        vendorId={selectedUserId as number} // Type assertion if you're sure it's not null when open
      />
    </div>
  );
}

{
  /* <BanVendorDialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  user={{ id: 123, name: "John Doe" }}
  isBanned={isBanned}
  onConfirm={(userId) => {
    console.log(`${isBanned ? "Unbanning" : "Banning"} user:`, userId);
    setIsBanned(!isBanned);
    setDialogOpen(false);
  }}
/> */
}
