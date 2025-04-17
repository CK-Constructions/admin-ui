import { useState } from "react";
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Chip, Tooltip } from "@mui/material";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { TQueryParams } from "../lib/types/common";
import { TAdmin } from "../lib/types/response";
import { FaBan, FaEdit, FaEye } from "react-icons/fa";
import { BsUniversalAccessCircle } from "react-icons/bs";
import { sanitizeValue } from "../utils/utils";
import { countStyle } from "../vendors/Vendors";
import AddUser from "./AddUser";
import { TUserFormData } from "../lib/types/payloads";
import { BanAdmin } from "./BanAdmin";
import VIewSupport from "./VIewSupport";
import EditSupport from "./EditSupport";
import { useNavigate } from "react-router";
import Header from "../common/Header";

export default function Users() {
  const navigate = useNavigate();

  // State variables
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TAdmin | null>(null);
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
  const { queryFn: UserFunc, queryKey: userKey } = queryConfigs.useGetAdmins;
  const { data, refetch } = useGetQuery({
    func: UserFunc,
    key: userKey,
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
  const handleOpenEdit = (user: TAdmin) => {
    setEditingUserId(user.id);
    setOpenBanDialog(true);
  };
  const handleOpenBanDialog = (user: TAdmin) => {
    setSelectedUser(user);
    setOpenBanDialog(true);
  };
  const handleOpenViewDialog = (user: TAdmin) => {
    setSelectedUserId(user.id);

    setOpenViewDialog(true);
  };
  // const handleCloseBanDialog = () => {
  //   setOpenBanDialog(false);
  // };

  // Form submission and navigation functions
  const handleSubmit = (userData: TUserFormData) => {
    // Here you would typically send the data to your API
  };
  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="pb-4">
        <Header
          onBackClick={handleClickBack}
          onReloadClick={refetch}
          showButton={true}
          buttonTitle="Add User"
          pageName="Users"
          buttonFunc={() => setIsModalOpen(true)}
        />
      </div>

      <div className="flex flex-col h-full   p-6">
        {/* <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-semibold text-[#171717]">Support Admins</h1>
        <Button onClick={() => setIsModalOpen(true)} variant="outlined">
          Add User
        </Button>
      </div> */}
        {}
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
        {}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "black" }}>
                <TableCell sx={{ color: "white" }}>Name</TableCell>
                <TableCell sx={{ color: "white" }}>Email</TableCell>
                <TableCell sx={{ color: "white" }}>Mobile</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.result.list.map((user: TAdmin) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active === 0 ? "Active" : "Disabled"}
                      color={user.is_active === 0 ? "success" : "error"}
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
                      <Tooltip title="Edit">
                        <button onClick={() => handleOpenEdit(user)} className="action-button">
                          <FaEdit size={14} />
                        </button>
                      </Tooltip>
                      <Tooltip title="View">
                        <button onClick={() => handleOpenViewDialog(user)} className="action-button">
                          <FaEye size={14} />
                        </button>
                      </Tooltip>
                      {user.is_active === 0 && (
                        <Tooltip title="Ban User">
                          <button onClick={() => handleOpenBanDialog(user)} className="red-action-button">
                            <FaBan size={14} />
                          </button>
                        </Tooltip>
                      )}
                      {user.is_active === 1 && (
                        <Tooltip title="UnBan User">
                          <button onClick={() => handleOpenBanDialog(user)} className="green-action-button">
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
        {}
        <div className="flex items-center justify-center mt-5">
          <div className="flex items-center justify-end space-x-3">
            {sanitizeValue(data?.result?.count) > 0 && (
              <Pagination
                count={Math.ceil(sanitizeValue(data?.result?.count) / limit)}
                size="medium"
                page={currentPage}
                onChange={handlePageChange}
              />
            )}
            <p className="flex items-center space-x-2 font-medium text-slate-700">
              <span>Total result:</span>
              <span className={countStyle}>{sanitizeValue(data?.result?.count)}</span>
            </p>
          </div>
        </div>
        <AddUser open={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
        <BanAdmin
          open={openBanDialog && !!selectedUser}
          onClose={() => setOpenBanDialog(false)}
          isBanned={selectedUser?.is_active === 1 ? true : false}
          user={selectedUser as TAdmin}
        />
        <VIewSupport open={openViewDialog && !!selectedUserId} onClose={() => setOpenViewDialog(false)} userid={selectedUserId as number} />
        <EditSupport open={editingUserId !== null} onClose={() => setEditingUserId(null)} userid={editingUserId || 0} />
      </div>
    </>
  );
}
