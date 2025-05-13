import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TApprovalData } from "../lib/types/common";
import Header from "../common/Header";
import { useNavigate } from "react-router";
import { FaCheck, FaEye, FaTimes } from "react-icons/fa";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery, useMutationQuery } from "../../query/hooks/queryHook";
import { showNotification } from "../utils/utils";
import { TApprovalPayload } from "../lib/types/payloads";
import ApprovalDialog from "./ApprovalDialog";
import { BiCategory } from "react-icons/bi";

const Approval = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [approvalData, setApprovalData] = useState<TApprovalPayload>({
    listing_id: "",
    approval_status: "",
  });
  const { mutationFn, queryKey } = queryConfigs.useUpdateApproval;
  const { queryFn: vendorFunc, queryKey: vendorKey } = queryConfigs.useGetAllApprovals;
  const { data, isLoading, isLoadingError, isFetching, isRefetching, isRefetchError } = useGetQuery({
    func: vendorFunc,
    key: vendorKey,
    params: {
      limit,
      offset: (currentPage - 1) * limit,
    },
  });
  const { mutate: updateApproval } = useMutationQuery({
    invalidateKey: queryKey,
    func: mutationFn,
    onSuccess: () => {
      showNotification("success", "Listing Approval Updated Successfully");
      handleCloseDialog();
    },
  });
  const handleApprove = (approval: TApprovalData) => {
    updateApproval({
      body: {
        listing_id: approval.listing_id,
        approval_status: 1,
      },
      id: approval.id,
    });
  };
  const handleReject = (approval: TApprovalData) => {
    updateApproval({
      body: {
        listing_id: approval.listing_id,
        approval_status: 0,
      },
      id: approval.id,
    });
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<TApprovalData | null>(null);
  const handleOpenDialog = (approval: TApprovalData) => {
    setSelectedApproval(approval);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Loading state
  if (isLoading || isFetching || isRefetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
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
    <div className="p-3">
      <>
        <div className="mb-4">
          <Header onBackClick={() => navigate(-1)} pageName="Listing Approvals" />
        </div>
        <TableContainer sx={{ maxHeight: 540, scrollbarWidth: 0 }} component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead sx={{ backgroundColor: "black" }}>
              <TableRow>
                <TableCell sx={{ color: "white", backgroundColor: "black" }}>ID</TableCell>
                <TableCell sx={{ color: "white", backgroundColor: "black" }}>Seller Name</TableCell>
                <TableCell sx={{ color: "white", backgroundColor: "black" }}>Category Name</TableCell>
                <TableCell sx={{ color: "white", backgroundColor: "black" }}>Listing Price</TableCell>
                <TableCell sx={{ color: "white", backgroundColor: "black" }}>Approval Status</TableCell>
                <TableCell sx={{ color: "white", backgroundColor: "black" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.result.list?.map((row: TApprovalData) => (
                <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.seller_name}</TableCell>
                  <TableCell>{row.category_name}</TableCell>
                  <TableCell>{row.listing_price}</TableCell>
                  <TableCell>
                    {}
                    <Chip
                      label={row.approval_status === 0 ? "Verified" : "Pending"}
                      color={row.approval_status === 0 ? "success" : "error"}
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
                    <div className="flex space-x-2">
                      <Tooltip title="Approve/Reject">
                        <button
                          onClick={() => handleOpenDialog(row)}
                          className="flex items-center justify-center p-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors border border-green-500 shadow-sm hover:shadow-md w-8 h-8"
                        >
                          <BiCategory size={14} color="white" />
                        </button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
      <ApprovalDialog
        open={openDialog}
        onClose={handleCloseDialog}
        approval={selectedApproval}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />
    </div>
  );
};
export default Approval;
