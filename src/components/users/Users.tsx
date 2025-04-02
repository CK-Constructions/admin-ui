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
} from "@mui/material";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { TQueryParams } from "../lib/types/common";
import { TUser } from "../lib/types/response";
import { FaBan, FaEdit, FaEye } from "react-icons/fa";
import { BanDialog } from "./BanDialog";
import ViewUser from "./ViewUser";

export default function Users() {
  const [limit, setLimit] = useState<number>(10);
  const [selectedUser, setSelectedUser] =
    useState<TUser | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<
    number | null
  >(null);
  const [offset, setOffset] = useState<number>(0);
  const [params, setParams] = useState<TQueryParams>({
    email: "",
    username: "",
    mobile: "",
  });
  const [searchParams, setSearchParams] =
    useState<TQueryParams>({
      email: "",
      username: "",
      mobile: "",
    });

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };
  const { queryFn: UserFunc, queryKey: userKey } =
    queryConfigs.useGetUsers;

  const { data } = useGetQuery({
    func: UserFunc,
    key: userKey,
    params: {
      offset,
      limit,
      ...searchParams,
    },
  });

  const [page, setPage] = useState<number>(1);
  const totalPages = Math.ceil(
    (data?.result?.count || 0) / limit
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    setParams((prev) => ({
      ...prev,
      offset: (value - 1) * limit,
    }));
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
  const [openViewDialog, setOpenViewDialog] =
    useState(false);

  const handleOpenBanDialog = (user: TUser) => {
    setSelectedUser(user);
    setOpenBanDialog(true);
  };
  const handleOpenViewDialog = (user: TUser) => {
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
        <h1 className="text-2xl font-semibold text-[#171717]">
          Users
        </h1>
        <Button variant="outlined">Add User</Button>
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
            <Button
              variant="outlined"
              onClick={handleSearch}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </div>
      </>

      {/* Table Section */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "black" }}>
              <TableCell sx={{ color: "white" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                Email
              </TableCell>

              <TableCell sx={{ color: "white" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.result.list.map((user: TUser) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.email}</TableCell>

                <TableCell>
                  <Chip
                    label={
                      user.status === "0"
                        ? "Active"
                        : "Disabled"
                    }
                    color={
                      user.status === "0"
                        ? "success"
                        : "error"
                    }
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
                    <Tooltip title="Edit">
                      <button className="flex items-center justify-center p-2 text-neutral-700 bg-white rounded-md hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-sm hover:shadow-md w-8 h-8">
                        <FaEdit size={14} />
                      </button>
                    </Tooltip>

                    <Tooltip title="View">
                      <button
                        onClick={() =>
                          handleOpenViewDialog(user)
                        }
                        className="flex items-center justify-center p-2 text-neutral-700 bg-white rounded-md hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-sm hover:shadow-md w-8 h-8"
                      >
                        <FaEye size={14} />
                      </button>
                    </Tooltip>

                    <Tooltip title="Ban User">
                      <button
                        onClick={() =>
                          handleOpenBanDialog(user)
                        }
                        className="flex items-center justify-center p-2 text-red-600 bg-white rounded-md hover:bg-red-50 transition-colors border border-red-200 shadow-sm hover:shadow-md w-8 h-8"
                      >
                        <FaBan size={14} />
                      </button>
                    </Tooltip>
                  </section>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      <div className="flex justify-center mt-6">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </div>
      <BanDialog
        open={openBanDialog && !!selectedUser} // Only open if selectedUser exists
        onClose={() => setOpenBanDialog(false)}
        user={selectedUser as TUser} // Type assertion if you're sure it's not null when open
        onConfirm={(userId) => {
          setOpenBanDialog(false);
        }}
      />
      <ViewUser
        open={openViewDialog && !!selectedUserId} // Only open if selectedUser exists
        onClose={() => setOpenViewDialog(false)}
        userid={selectedUserId as number} // Type assertion if you're sure it's not null when open
      />
    </div>
  );
}
