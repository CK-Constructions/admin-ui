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
  Tooltip,
  CircularProgress,
  Box,
  Typography,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery, useMutationQuery } from "../../query/hooks/queryHook";
import type { TApprovalData, TQueryParams } from "../lib/types/common";
import type { TServiceapproval } from "../lib/types/response";
import { FaBan, FaCheck, FaEdit, FaEye, FaTimes } from "react-icons/fa";
import { sanitizeValue, showNotification } from "../utils/utils";
import { countStyle } from "../vendors/Vendors";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import Header from "../common/Header";
import ApprovalDialog from "../approval/ApprovalDialog";
import { BiCategory } from "react-icons/bi";
const tableHeaders = [
  { id: "id", label: "ID" },
  { id: "category_name", label: "Category" },
  { id: "seller_fullname", label: "Seller" },
  { id: "approved_on", label: "Approved On" },
  { id: "created_on", label: "Created On" },
  { id: "actions", label: "Actions" },
];
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`rental-tabpanel-${index}`} aria-labelledby={`rental-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}
export default function ServiceApproval() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TServiceapproval | null>(null);
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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<TServiceapproval>({
    id: 0,
    approval_status: 0,
    service_id: 0,
    category: 0,
    seller_id: 0,
    approved_on: "",
    created_on: "",
    seller_username: "",
    seller_fullname: "",
    category_name: "",
  });
  const handleOpenDialog = (approval: TServiceapproval) => {
    console.log("approval", approval);
    setSelectedApproval({
      id: approval.id || 0,
      approval_status: approval.approval_status || 0,
      service_id: approval.service_id || 0,
      category: approval.category || 0,
      seller_id: approval.seller_id || 0,
      approved_on: approval.approved_on || "",
      created_on: approval.created_on || "",
      seller_username: approval.seller_username || "",
      seller_fullname: approval.seller_fullname || "",
      category_name: approval.category_name || "",
    });
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const limit = 10;
  const { queryFn: rentalFunc, queryKeys: rentalKey } = queryConfigs.useActiveGetService;
  const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
    func: rentalFunc,
    key: rentalKey,
    params: {
      offset: (currentPage - 1) * limit,
      limit,
      ...searchParams,
    },
  });
  const { queryFn: confirmedFunc, queryKeys: confirmedKey } = queryConfigs.useConfirmedGetService;
  const { queryFn: updateServiceApproval, queryKeys: updateKey } = queryConfigs.useUpdateService;
  const { mutate: updateApproval } = useMutationQuery({
    invalidateKey: updateKey,
    func: updateServiceApproval,
    onSuccess: () => {
      showNotification("success", "Service Approval Updated Successfully");
      handleCloseDialog();
    },
  });
  const {
    data: confirmedData,
    refetch: refetchConfirmed,
    isLoading: isLoadingConfirmed,
    isRefetching: isRefetchingConfirmed,
    isError: isErrorConfirmed,
  } = useGetQuery({
    func: confirmedFunc,
    key: confirmedKey,
    params: {
      offset: (currentPage - 1) * limit,
      limit,
      ...searchParams,
    },
  });
  const { queryFn: rejectedFunc, queryKeys: rejectedKey } = queryConfigs.useRejectedGetService;
  const {
    data: rejectedData,
    refetch: refetchRejected,
    isLoading: isLoadingRejected,
    isRefetching: isRefetchingRejected,
    isError: isErrorRejected,
  } = useGetQuery({
    func: rejectedFunc,
    key: rejectedKey,
    params: {
      offset: (currentPage - 1) * limit,
      limit,
      ...searchParams,
    },
  });
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setCurrentPage(1);
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
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
  };
  const handleOpenEdit = (rental: TServiceapproval) => {
    setEditingUserId(rental?.id);
    setOpenBanDialog(true);
  };
  const handleOpenBanDialog = (rental: TServiceapproval) => {
    setSelectedUser(rental);
    setOpenBanDialog(true);
  };
  const handleOpenViewDialog = (rental: TServiceapproval) => {
    setSelectedUserId(rental?.id);
    setOpenViewDialog(true);
  };
  const handleApprove = (approval: TServiceapproval) => {
    updateApproval({
      body: {
        service_id: approval.service_id,
        approval_status: 0,
      },
      id: approval.id,
    });
  };
  const handleReject = (approval: TServiceapproval) => {
    updateApproval({
      body: {
        service_id: approval.service_id,
        approval_status: 1,
      },
      id: approval.id,
    });
  };
  const handleClickBack = () => {
    navigate(-1);
  };
  const handleNavToView = (id: number) => {
    if (id) {
      navigate(`/services/${id}`);
    }
  };
  const getCurrentData = () => {
    switch (tabValue) {
      case 0:
        return {
          data,
          isLoading: isLoading || isRefetching,
          isError,
          refetch,
        };
      case 1:
        return {
          data: rejectedData,
          isLoading: isLoadingRejected || isRefetchingRejected,
          isError: isErrorRejected,
          refetch: refetchRejected,
        };
      case 2:
        return {
          data: confirmedData,
          isLoading: isLoadingConfirmed || isRefetchingConfirmed,
          isError: isErrorConfirmed,
          refetch: refetchConfirmed,
        };
      default:
        return {
          data,
          isLoading: isLoading || isRefetching,
          isError,
          refetch,
        };
    }
  };
  const currentTabData = getCurrentData();
  const renderTableContent = () => {
    if (currentTabData.isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      );
    }
    if (currentTabData.isError) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography color="error">Error loading rentals. Please try again.</Typography>
        </Box>
      );
    }
    if (!currentTabData.data?.result?.list || currentTabData.data.result.list.length === 0) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Services found
          </Typography>
        </Box>
      );
    }
    return (
      <>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "black" }}>
                {tableHeaders.map((header) => (
                  <TableCell key={header.id} sx={{ color: "white" }}>
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTabData.data?.result.list.map((rental: TServiceapproval) => (
                <TableRow key={rental?.id}>
                  <TableCell>{rental?.id}</TableCell>
                  <TableCell>{rental?.category_name}</TableCell>
                  <TableCell>{rental?.seller_fullname}</TableCell>
                  <TableCell>{rental?.approved_on ? dayjs(rental?.approved_on).format("DD/MM/YYYY") : "-"}</TableCell>
                  <TableCell>{dayjs(rental?.created_on).format("DD/MM/YYYY")}</TableCell>
                  <TableCell>
                    <section className="w-full flex gap-2">
                      <Tooltip title="View">
                        <button onClick={() => handleNavToView(rental.service_id)} className="action-button">
                          <FaEye size={14} />
                        </button>
                      </Tooltip>
                      {tabValue === 0 && (
                        <div className="flex space-x-2">
                          <Tooltip title="Approve/Reject">
                            <button
                              onClick={() => handleOpenDialog(rental)}
                              className="flex items-center justify-center p-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors border border-green-500 shadow-sm hover:shadow-md w-8 h-8"
                            >
                              <BiCategory size={14} color="white" />
                            </button>
                          </Tooltip>
                        </div>
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
            {sanitizeValue(currentTabData.data?.result?.count) > 0 && (
              <Pagination count={Math.ceil(sanitizeValue(currentTabData.data?.result?.count) / limit)} size="medium" page={currentPage} onChange={handlePageChange} />
            )}
            <p className="flex items-center space-x-2 font-medium text-slate-700">
              <span>Total result:</span>
              <span className={countStyle}>{sanitizeValue(currentTabData.data?.result?.count)}</span>
            </p>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="pb-4">
        <Header
          onBackClick={handleClickBack}
          onReloadClick={currentTabData.refetch}
          showButton={false}
          buttonTitle="Add Service"
          pageName="Service Approvals"
          buttonFunc={() => setIsModalOpen(true)}
        />
      </div>
      <div className="flex flex-col h-full p-6">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="rental approval tabs" indicatorColor="primary" textColor="primary">
            <Tab label="Active Services" id="rental-tab-0" aria-controls="rental-tabpanel-0" />
            <Tab label="Rejected Services" id="rental-tab-1" aria-controls="rental-tabpanel-1" />
            <Tab label="Confirmed Services" id="rental-tab-2" aria-controls="rental-tabpanel-2" />
          </Tabs>
        </Box>
        <div className="my-6 flex gap-2">
          <TextField
            name="email"
            label="Seller"
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
            label="ID"
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
            label="Category"
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
        <TabPanel value={tabValue} index={0}>
          {renderTableContent()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderTableContent()}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderTableContent()}
        </TabPanel>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Approve or Reject Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {selectedApproval?.approval_status === 0 ? "approve" : "reject"} the approval for listing {selectedApproval?.service_id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<FaCheck />} onClick={() => handleApprove(selectedApproval)} color="success">
            Approve
          </Button>
          <Button startIcon={<FaTimes />} onClick={() => handleReject(selectedApproval)} color="error">
            Reject
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
