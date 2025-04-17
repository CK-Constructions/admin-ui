import { useState } from "react";
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Chip, Tooltip } from "@mui/material";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { TQueryParams } from "../lib/types/common";
import { TUser } from "../lib/types/response";
import { FaBan, FaEdit, FaEye } from "react-icons/fa";
import { BanDialog } from "./BanDialog";
import ViewUser from "./ViewUser";
import { BsUniversalAccessCircle } from "react-icons/bs";
import { sanitizeValue } from "../utils/utils";
import { countStyle } from "../vendors/Vendors";
import Header from "../common/Header";
import { useNavigate } from "react-router";

export default function Buyers() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [offset, setOffset] = useState<number>(0);
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
  const { queryFn: UserFunc, queryKey: userKey } = queryConfigs.useGetUsers;
  const { data } = useGetQuery({
    func: UserFunc,
    key: userKey,
    params: {
      offset: (currentPage - 1) * limit,
      limit,
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
  const handleOpenBanDialog = (user: TUser) => {
    setSelectedUser(user);
    setOpenBanDialog(true);
  };
  const handleOpenViewDialog = (user: TUser) => {
    setSelectedUserId(user.id);

    setOpenViewDialog(true);
  };
  const handleCloseBanDialog = () => {
    setOpenBanDialog(false);
  };
  return (
    <div className="flex flex-col h-full ">
      <div className=" pb-4">
        <Header
          onBackClick={() => navigate(-1)}
          // onReloadClick={refetch}
          // showButton={true}
          // buttonTitle="Add Buyers"
          pageName="Buyers"
          // buttonFunc={() => setIsModalOpen(true)}
        />
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
            {data?.result.list.map((user: TUser) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status === 0 ? "Active" : "Disabled"}
                    color={user.status === 0 ? "success" : "error"}
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
                      <button className="action-button">
                        <FaEdit size={14} />
                      </button>
                    </Tooltip>
                    <Tooltip title="View">
                      <button onClick={() => handleOpenViewDialog(user)} className="action-button">
                        <FaEye size={14} />
                      </button>
                    </Tooltip>
                    {user.status === 0 && (
                      <Tooltip title="Ban User">
                        <button onClick={() => handleOpenBanDialog(user)} className="red-action-button ">
                          <FaBan size={14} />
                        </button>
                      </Tooltip>
                    )}
                    {user.status === 1 && (
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
            <Pagination count={Math.ceil(sanitizeValue(data?.result?.count) / limit)} size="medium" page={currentPage} onChange={handlePageChange} />
          )}
          <p className="flex items-center space-x-2 font-medium text-slate-700">
            <span>Total result:</span>
            <span className={countStyle}>{sanitizeValue(data?.result?.count)}</span>
          </p>
        </div>
      </div>
      <BanDialog
        open={openBanDialog && !!selectedUser}
        onClose={() => setOpenBanDialog(false)}
        isBanned={selectedUser?.status === 1 ? true : false}
        user={selectedUser as TUser}
      />
      <ViewUser open={openViewDialog && !!selectedUserId} onClose={() => setOpenViewDialog(false)} userid={selectedUserId as number} />
    </div>
  );
}
