import type React from "react";
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
  Select,
  type SelectChangeEvent,
  FormControl,
  InputLabel,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery, useMutationQuery } from "../../query/hooks/queryHook";
import type { TQueryParams } from "../lib/types/common";
import type { TSubCategory, TSubCatImage } from "../lib/types/response";
import { FaBan, FaCameraRetro, FaEdit, FaTrash } from "react-icons/fa";
import { BsUniversalAccessCircle } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";
import { sanitizeValue, showNotification } from "../utils/utils";
import { countStyle } from "../vendors/Vendors";
import { useNavigate } from "react-router";
import Header from "../common/Header";
import dayjs from "dayjs";
import Loading from "../common/Loader";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
export default function SubCategory() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TSubCategory | null>(null);
  const [params, setParams] = useState<TQueryParams>({
    id: "",
    name: "",
  });
  const [searchParams, setSearchParams] = useState<TQueryParams>({
    id: "",
    name: "",
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { queryFn: getCategoryFunc, queryKey: categoryKey } = queryConfigs.useGetAllCategories;
  const { data: catData } = useGetQuery({
    func: getCategoryFunc,
    key: categoryKey,
    params: {
      offset: 0,
      limit: 1000,
      ...searchParams,
    },
  });
  const [selectedItem, setSelectedItem] = useState<string>("");
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItem(event.target.value);
  };
  const [editCategory, setEditCategory] = useState<TSubCategory | null>(null);
  const limit = 10;
  const { queryFn: useDeleteFunc, queryKeys: deleteKey } = queryConfigs.useDeleteSubCategory;
  const { queryFn: useUpdateFunc, queryKeys: updateKey } = queryConfigs.useUpdateSubCategory;
  const { queryFn: getSubCategoryFunc, queryKeys: subCategoryKey } = queryConfigs.useGetAllSubCategories;
  const { queryFn: addSubCategoryFunc } = queryConfigs.useAddSubCategory;
  const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
    func: getSubCategoryFunc,
    key: subCategoryKey,
    params: {
      offset: (currentPage - 1) * limit,
      limit,
      ...searchParams,
    },
  });
  const handleOpenImages = (category: TSubCatImage) => {
    navigate(`/sub-category/images/${category.id}`);
  };
  const { mutate: addSubCategory } = useMutationQuery({
    invalidateKey: subCategoryKey,
    func: addSubCategoryFunc,
    onSuccess: () => {
      showNotification("success", "SubCategory added successfully");
      handleCloseModal();
      refetch();
    },
    onError: () => {
      setIsAdding(false);
    },
  });
  const { mutate: updateSubCategory } = useMutationQuery({
    invalidateKey: updateKey,
    func: useUpdateFunc,
    onSuccess: () => {
      showNotification("success", "SubCategory added successfully");
      handleCloseModal();
      refetch();
    },
  });
  const { mutate: deleteSubCategory } = useMutationQuery({
    invalidateKey: deleteKey,
    func: useDeleteFunc,
    onSuccess: () => {
      showNotification("success", "SubCategory deleted successfully");
      handleCloseDeleteDialog();
      refetch();
    },
    onError: () => {
      setIsDeleting(false);
    },
  });
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };
  const handleSearch = () => {
    setSearchParams(params);
    setCurrentPage(1);
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
    setCurrentPage(1);
  };
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
  };
  const handleOpenEdit = (category: TSubCategory) => {
    setEditCategory(category);
    setOpenEditDialog(true);
  };
  const handleCloseEditModal = () => {
    setOpenEditDialog(false);
    setEditCategory(null);
    setIsUpdating(false);
  };
  const handleOpenBanDialog = (category: TSubCategory) => {
    setSelectedUser(category);
    setOpenBanDialog(true);
  };
  const handleCloseBanDialog = () => {
    setOpenBanDialog(false);
    setSelectedUser(null);
  };
  const handleOpenDeleteDialog = (category: TSubCategory) => {
    setSelectedUser(category);
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
    setIsDeleting(false);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCategoryName("");
    setIsAdding(false);
  };
  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName && selectedItem.length >= 0) {
      showNotification("error", "Category name cannot be empty");
      return;
    }
    setIsAdding(true);
    addSubCategory({
      name: trimmedName.toLowerCase(),
      category_id: Number.parseInt(selectedItem),
    });
  };
  const handleUpdateCategory = () => {
    if (!editCategory || !editCategory?.name.trim()) {
      showNotification("error", "SubCategory name cannot be empty");
      return;
    }
    if (!editCategory || !editCategory?.category_id) {
      showNotification("error", "Category cannot be empty");
      return;
    }
    setIsUpdating(true);
    updateSubCategory({ body: editCategory, id: editCategory.id });
  };
  const handleToggleStatus = () => {
    if (!selectedUser) return;
    setIsUpdating(true);
    updateSubCategory({
      id: selectedUser.id,
      is_active: selectedUser.is_active === 0 ? 1 : 0,
    });
  };
  const handleDeleteCategory = () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    deleteSubCategory(selectedUser.id);
  };
  const handleClickBack = () => {
    navigate(-1);
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
        <Typography color="error">Error loading categories. Please try again.</Typography>
      </Box>
    );
  }
  return (
    <>
      <div className="pb-4">
        <Header onBackClick={handleClickBack} onReloadClick={refetch} showButton={true} buttonTitle="Add SubCategory" pageName="Sub Category" buttonFunc={handleOpenModal} />
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
        {!data?.result?.list || data?.result?.list?.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="50vh"
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              padding: "2rem",
              border: "1px dashed #ccc",
            }}
          >
            <MdOutlineCategory size={60} color="#9e9e9e" />
            <Typography variant="h5" color="textSecondary" gutterBottom sx={{ mt: 2, fontWeight: 500 }}>
              No subcategories found
            </Typography>
            <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 3, maxWidth: "400px" }}>
              {searchParams.name || searchParams.id
                ? "No results match your search criteria. Try clearing filters or add a new subcategory."
                : "There are no subcategories available. Get started by adding your first subcategory."}
            </Typography>
            <div className="flex gap-3">
              {(searchParams.name || searchParams.id) && (
                <Button variant="outlined" onClick={handleClear} startIcon={<FaBan />}>
                  Clear Filters
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleOpenModal}
                startIcon={<FaEdit />}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",

                  "&:hover": { backgroundColor: "#1565c0" },
                }}
              >
                Add New Subcategory
              </Button>
            </div>
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
                  {data?.result?.list?.map((category: TSubCategory) => (
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
                          <Tooltip title="Images">
                            <button onClick={() => handleOpenImages(category)} className="action-button">
                              <FaCameraRetro size={14} />
                            </button>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <button onClick={() => handleOpenEdit(category)} className="action-button">
                              <FaEdit size={14} />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <button onClick={() => handleOpenDeleteDialog(category)} className="red-action-button">
                              <FaTrash size={14} />
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
                  <Pagination count={Math.ceil(sanitizeValue(data?.result?.count) / limit)} size="medium" page={currentPage} onChange={handlePageChange} color="primary" />
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
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Add New SubCategory</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <div className="space-y-5">
              <TextField fullWidth label="SubCategory" variant="outlined" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} disabled={isAdding} />
              <FormControl fullWidth>
                <InputLabel id="dropdown-label">Select Category</InputLabel>
                <Select labelId="dropdown-label" id="dropdown" value={selectedItem} label="Select Category" onChange={handleChange}>
                  {catData?.result.list?.map((item: TSubCategory) => (
                    <MenuItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={isAdding}>
            Cancel
          </Button>
          <Button onClick={handleAddCategory} variant="contained" disabled={isAdding || !newCategoryName.trim()} color="primary">
            {isAdding ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog && !!editCategory} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
        <DialogTitle>Edit SubCategory</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <div className="space-y-5">
              <TextField
                fullWidth
                label="SubCategory"
                variant="outlined"
                value={editCategory?.name}
                onChange={(e) => setEditCategory((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                disabled={isUpdating}
              />
              <Autocomplete
                options={catData?.result?.list || []}
                getOptionLabel={(option: TSubCategory) => option.category_name}
                value={data?.result?.list?.find((item: TSubCategory) => item.category_id === editCategory?.category_id) || null}
                onChange={(event, newValue: TSubCategory | null) => {
                  if (newValue && editCategory) {
                    setEditCategory({ ...editCategory, category_id: newValue.category_id });
                  }
                }}
                isOptionEqualToValue={(option, value) => option.category_id === value.category_id}
                renderInput={(params) => <TextField {...params} label="Select Category" fullWidth />}
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateCategory}
            variant="contained"
            disabled={isUpdating || !editCategory}
            color="primary"
            sx={{
              color: "white",
            }}
          >
            {isUpdating ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog
        open={openBanDialog && !editCategoryData}
        onClose={handleCloseBanDialog}
        title={`${selectedUser?.is_active === 0 ? "Disable" : "Enable"} Category`}
        content={`Are you sure you want to ${selectedUser?.is_active === 0 ? "disable" : "enable"} this subCategory?`}
        onConfirm={handleToggleStatus}
        loading={isUpdating}
      />
      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title="Delete SubCategory"
        content="Are you sure you want to delete this subCategory? This action cannot be undone."
        onConfirm={handleDeleteCategory}
        loading={isDeleting}
        confirmText="Delete"
        confirmColor="error"
      />
    </>
  );
}
