import React from "react";
import { Modal, Box, Typography, Avatar, Divider, IconButton, Paper, Stack, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TUser } from "../lib/types/response";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";

interface ViewUserProps {
  open: boolean;
  onClose: () => void;
  userid: number;
}

const ViewUser: React.FC<ViewUserProps> = ({ open, onClose, userid }) => {
  const { queryFn: UserFunc, queryKey: userKey } = queryConfigs.useGetUserById;

  const { data } = useGetQuery({
    func: UserFunc,
    key: userKey,
    params: {
      id: userid ?? null,
    },
    isEnabled: userid ? true : false,
  });

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="user-view-modal" aria-describedby="user-details-view">
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
            // src={data?.result?.profile_picture}
            src={`${process.env.REACT_APP_GET_MEDIA}/${data?.result?.profile_picture}`}
            sx={{
              width: 200,
              height: 200,
              fontSize: 48,
              bgcolor: "primary.main",
            }}
          >
            {!data?.result?.profile_picture && data?.result?.username.charAt(0).toUpperCase()}
          </Avatar>

          <Box textAlign="center">
            <Typography variant="h5" component="h2">
              {data?.result?.fullname || data?.result?.username}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              @{data?.result?.username}
            </Typography>
          </Box>

          <Divider flexItem />

          <Stack spacing={2} width="100%">
            <DetailRow label="Email" value={data?.result?.email} />
            <DetailRow label="Mobile" value={data?.result?.mobile} />
            <DetailRow label="Address" value={data?.result?.address} />
            <DetailRow label="Gender" value={data?.result?.gender} />

            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Member Since:
              </Typography>
              <Typography variant="body2">{new Date(data?.result?.created_on).toLocaleDateString()}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Status:
              </Typography>
              <Chip
                label={data?.result?.status === "0" ? "Active" : "Disabled"}
                color={data?.result?.status === "0" ? "success" : "error"}
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

export default ViewUser;
