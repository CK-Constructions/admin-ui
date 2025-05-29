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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery, useMutationQuery } from "../../query/hooks/queryHook";
import { TQueryParams } from "../lib/types/common";
import { TCategory } from "../lib/types/response";
import { FaBan, FaEdit, FaEye } from "react-icons/fa";
import { BsUniversalAccessCircle } from "react-icons/bs";
import { sanitizeValue, showNotification } from "../utils/utils";
import { countStyle } from "../vendors/Vendors";
import { TUserFormData } from "../lib/types/payloads";
import { useNavigate } from "react-router";
import Header from "../common/Header";
import dayjs from "dayjs";
import Loading from "../common/Loader";
export default function ListingCategory() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<TCategory | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [params, setParams] = useState<TQueryParams>({
    id: "",
    name: "",
  });
  const [searchParams, setSearchParams] = useState<TQueryParams>({
    id: "",
    name: "",
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const limit = 10;
  const { queryFn: getCategoryFunc, queryKey: categoryKey } = queryConfigs.useGetAllCategories;
  const { queryFn: addCategory } = queryConfigs.useAddCategories;
  const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
    func: getCategoryFunc,
    key: categoryKey,
    params: {
      offset: (currentPage - 1) * limit,
      limit,
      ...searchParams,
    },
  });
  const { mutate } = useMutationQuery({
    invalidateKey: categoryKey,
    func: addCategory,
    onSuccess: () => {
      showNotification("success", "Listing Category Added Successfully");
      handleCloseModal();
      refetch();
    },
  });
  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      showNotification("error", "Category name cannot be empty");
      return;
    }

    mutate({
      name: trimmedName.toLowerCase(),
    });
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };
  const handleSearch = () => {
    setSearchParams(params);
  };
  const handleClear = () => {
    setParams({
      id: "",
      name: "",
    });
    setSearchParams({
      id: "",
      name: "",
    });
  };
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
  };
  const handleOpenEdit = (category: TCategory) => {
    setEditingUserId(category.id);
    setOpenBanDialog(true);
  };
  const handleOpenBanDialog = (category: TCategory) => {
    setSelectedUser(category);
    setOpenBanDialog(true);
  };
  const handleOpenViewDialog = (category: TCategory) => {
    setSelectedUserId(category.id);
    setOpenViewDialog(true);
  };
  const handleSubmit = (categoryData: TUserFormData) => {};
  const handleClickBack = () => {
    navigate(-1);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCategoryName("");
  };
  if (isLoading || isRefetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Loading />
      </Box>
    );
  }
  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">Error loading categorys. Please try again.</Typography>
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
            buttonTitle="Add Listing Category"
            pageName="Listing Categories"
            buttonFunc={handleOpenModal}
          />
        </div>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No categorys found
          </Typography>
          <Button variant="contained" onClick={() => setIsModalOpen(true)}>
            Add New User
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
          showButton={true}
          buttonTitle="Add Listing Category"
          pageName="Listing Categories"
          buttonFunc={handleOpenModal}
        />
      </div>
      <div className="flex flex-col h-full p-6">
        <div className="my-6 flex gap-2">
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            size="small"
            value={params.name}
            onChange={handleSearchChange}
            sx={{
              width: "20%",
            }}
          />
          <TextField
            name="id"
            label="ID"
            variant="outlined"
            size="small"
            value={params.id}
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
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "black", color: "white", px: 2 }}>ID</TableCell>
                <TableCell sx={{ backgroundColor: "black", color: "white", px: 2 }}>Name</TableCell>
                <TableCell sx={{ backgroundColor: "black", color: "white", px: 2 }}>Status</TableCell>
                <TableCell sx={{ backgroundColor: "black", color: "white", px: 2 }}>Created On</TableCell>
                <TableCell sx={{ backgroundColor: "black", color: "white", px: 2 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.result.list.map((category: TCategory) => (
                <TableRow key={category.id}>
                  <TableCell sx={{ px: 2 }}>{category.id}</TableCell>
                  <TableCell sx={{ px: 2 }} className="capitalize">
                    {category.name}
                  </TableCell>
                  <TableCell sx={{ px: 2 }}>
                    <Chip
                      label={category.is_active === 0 ? "Active" : "Disabled"}
                      color={category.is_active === 0 ? "success" : "error"}
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
                  <TableCell sx={{ px: 2 }}>{dayjs(category?.created_on).format("DD-MM-YYYY")}</TableCell>
                  <TableCell sx={{ px: 2 }}>
                    <section className="w-full flex gap-2">
                      <Tooltip title="Edit">
                        <button onClick={() => handleOpenEdit(category)} className="action-button">
                          <FaEdit size={14} />
                        </button>
                      </Tooltip>

                      {category.is_active === 0 && (
                        <Tooltip title="Disable">
                          <button onClick={() => handleOpenBanDialog(category)} className="red-action-button">
                            <FaBan size={14} />
                          </button>
                        </Tooltip>
                      )}
                      {category.is_active === 1 && (
                        <Tooltip title="Enable">
                          <button onClick={() => handleOpenBanDialog(category)} className="green-action-button">
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
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Add New Rental Category</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField fullWidth label="Category Name" variant="outlined" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} disabled={isAdding} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={isAdding}>
            Cancel
          </Button>
          <Button
            onClick={handleAddCategory}
            variant="contained"
            disabled={isAdding || !newCategoryName.trim()}
            sx={{
              color: "white",
            }}
          >
            {isAdding ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
