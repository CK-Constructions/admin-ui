import React from "react";
import { Modal, Box, Typography, Avatar, Divider, IconButton, Paper, Stack, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";

interface ViewVendorProps {
  open: boolean;
  onClose: () => void;
  vendorId: number;
}

const ViewVendor: React.FC<ViewVendorProps> = ({ open, onClose, vendorId }) => {
  const { queryFn: VendorFunc, queryKey: vendorKey } = queryConfigs.useGetVendorById;

  const { data } = useGetQuery({
    func: VendorFunc,
    key: vendorKey,
    params: {
      id: vendorId ?? null,
    },
    isEnabled: vendorId ? true : false,
  });

  const vendorData = data?.result;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="vendor-view-modal" aria-describedby="vendor-details-view">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600 },
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          outline: "none",
        }}
        component={Paper}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Stack spacing={3} alignItems="center">
          <Avatar
            // src={vendorData?.profile_picture}
            src={`${process.env.REACT_APP_GET_MEDIA}/${data?.result?.profile_picture}`}
            sx={{
              width: 200,
              height: 200,
              fontSize: 48,
              bgcolor: "primary.main",
            }}
          >
            {!vendorData?.profile_picture && vendorData?.username?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Box textAlign="center">
            <Typography variant="h5" component="h2">
              {vendorData?.fullname || vendorData?.username}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              @{vendorData?.username}
            </Typography>
          </Box>

          <Divider flexItem />

          <Stack spacing={2} width="100%">
            <DetailRow label="Email" value={vendorData?.email} />
            <DetailRow label="Mobile" value={vendorData?.mobile} />
            <DetailRow label="Address" value={vendorData?.address} />

            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Verified:
              </Typography>
              <Chip label={vendorData?.verified ? "Verified" : "Not Verified"} color={vendorData?.verified ? "success" : "warning"} size="small" />
            </Box>

            <DetailRow label="Aadhaar Number" value={vendorData?.aadhaar} />
            <DetailRow label="PAN Number" value={vendorData?.pan} />
            <DetailRow label="GST Number" value={vendorData?.gst} />

            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Registration Date:
              </Typography>
              <Typography variant="body2">{vendorData?.created_on ? new Date(vendorData.created_on).toLocaleDateString() : "N/A"}</Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

// Helper component for consistent detail rows
interface DetailRowProps {
  label: string;
  value?: string | null;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <Box display="flex" justifyContent="space-between">
    <Typography variant="body2" color="text.secondary">
      {label}:
    </Typography>
    <Typography variant="body2">{value || "Not provided"}</Typography>
  </Box>
);

export default ViewVendor;
