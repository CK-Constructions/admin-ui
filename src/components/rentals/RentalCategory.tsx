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
import { useNavigate } from "react-router";
import Header from "../common/Header";
import dayjs from "dayjs";
import Loading from "../common/Loader";

export default function RentalCategory() {
  const navigate = useNavigate();

  // State variables
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Query and data fetching
  const limit = 10;
  const { queryFn: getRentalFunc, queryKeys: rentalKey } = queryConfigs.useGetRentalCategories;
  const { queryFn: addRentalFunc } = queryConfigs.useAddRentalCategory;
  const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
    func: getRentalFunc,
    key: rentalKey,
    params: {
      offset: (currentPage - 1) * limit,
      limit,
      ...searchParams,
    },
  });

  const { mutate: addRental } = useMutationQuery({
    invalidateKey: rentalKey,
    func: addRentalFunc,
    onSuccess: () => {
      showNotification("success", "Rental category added successfully");
      handleCloseModal();
      refetch();
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
      id: "",
      name: "",
    });
    setSearchParams({
      id: "",
      name: "",
    });
  };

  // Pagination functions
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
  };

  // Dialog and modal functions
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

  // Modal functions
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCategoryName("");
  };

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      showNotification("error", "Category name cannot be empty");
      return;
    }

    addRental({
      name: trimmedName.toLowerCase(),
    });
  };

  // Form submission and navigation functions
  const handleSubmit = (categoryData: TCategory) => {
    // Here you would typically send the data to your API
  };

  const handleClickBack = () => {
    navigate(-1);
  };

  // Loading and error states
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
        <Typography color="error">Error loading categories. Please try again.</Typography>
      </Box>
    );
  }

  return (
    <>
      <div className="pb-4">
        <Header
          onBackClick={handleClickBack}
          onReloadClick={refetch}
          showButton={true}
          buttonTitle="Add Rental Category"
          pageName="Rental Categories"
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

        {!data?.result?.list || data.result.list.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No categories found
            </Typography>
            <Button variant="contained" onClick={handleOpenModal}>
              Add New Category
            </Button>
          </Box>
        ) : (
          <>
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
                      <TableCell sx={{ px: 2 }}>{category.name}</TableCell>
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
                            <Tooltip title="Ban User">
                              <button onClick={() => handleOpenBanDialog(category)} className="red-action-button">
                                <FaBan size={14} />
                              </button>
                            </Tooltip>
                          )}
                          {category.is_active === 1 && (
                            <Tooltip title="UnBan User">
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
          </>
        )}
      </div>

      {/* Add Rental Category Modal */}
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
