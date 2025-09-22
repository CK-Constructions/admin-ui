import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { FaCheck, FaTimes } from "react-icons/fa";
import { TApprovalData } from "../lib/types/common";

interface ApprovalDialogProps {
  open: boolean;
  onClose: () => void;
  approval: TApprovalData | null;
  handleApprove: (approval: TApprovalData) => void;
  handleReject: (approval: TApprovalData) => void;
}

const ApprovalDialog: React.FC<ApprovalDialogProps> = ({ open, onClose, approval, handleApprove, handleReject }) => {
  if (!approval) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Approve or Reject Approval</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to {approval.approval_status === 0 ? "approve" : "reject"} the approval for listing {approval.listing_id}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<FaCheck />} onClick={() => handleApprove(approval)} color="success">
          Approve
        </Button>
        <Button startIcon={<FaTimes />} onClick={() => handleReject(approval)} color="error">
          Reject
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApprovalDialog;
