import { FaBan, FaCheckCircle } from "react-icons/fa";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Stack, Typography } from "@mui/material";
import { queryConfigs } from "../../query/queryConfig";
import { useMutationQuery } from "../../query/hooks/queryHook";
import { showNotification } from "../utils/utils";
import { TBanner } from "../lib/types/common";
type BannerStatusModalProps = {
  open: boolean;
  onClose: () => void;
  user: TBanner;
  isActive: boolean;
};
export function BannerStatusModal({ open, onClose, user, isActive }: BannerStatusModalProps) {
  const { queryFn: activateBanner, queryKeys: bannerKey } = queryConfigs.useEnableBanner;
  const { queryFn: deactivateBanner } = queryConfigs.useDisableBanner;
  const handleConfirmDeactivate = () => {
    if (user.id) {
      deactivate({ id: user.id });
    } else {
      showNotification("error", "Banner ID is missing, please try again");
    }
  };
  const handleConfirmActivate = () => {
    if (user.id) {
      activate({ id: user.id });
    } else {
      showNotification("error", "Banner ID is missing, please try again");
    }
  };
  const { mutate: activate } = useMutationQuery({
    invalidateKey: bannerKey,
    func: activateBanner,
    onSuccess: () => {
      showNotification("success", "Banner activated successfully");
      onClose();
    },
    onError: () => {
      showNotification("error", "Failed to activate banner");
    },
  });
  const { mutate: deactivate } = useMutationQuery({
    invalidateKey: bannerKey,
    func: deactivateBanner,
    onSuccess: () => {
      showNotification("success", "Banner deactivated successfully");
      onClose();
    },
    onError: () => {
      showNotification("error", "Failed to deactivate banner");
    },
  });
  const deactivationConsequences = ["Banner will no longer be visible to users", "All active campaigns using this banner will be paused", "Requires admin approval to reactivate"];
  const activationConsequences = ["Banner will become visible to users", "Can be assigned to new campaigns", "Will be available for immediate use"];
  const consequences = isActive ? deactivationConsequences : activationConsequences;
  const action = isActive ? "Deactivate" : "Activate";
  const actionColor = isActive ? "error.main" : "success.main";
  const icon = isActive ? <FaBan /> : <FaCheckCircle />;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="banner-status-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 400,
        },
      }}
    >
      <DialogTitle
        id="banner-status-dialog-title"
        sx={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: actionColor,
          borderBottom: 1,
          borderColor: "divider",
          py: 2,
          px: 3,
        }}
      >
        Confirm Banner {action}
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 2 }}>
        <DialogContentText sx={{ mt: 3 }}>
          Are you sure you want to {action.toLowerCase()}{" "}
          <Typography component="span" fontWeight={600} color={actionColor}>
            {user?.title || "this banner"}
          </Typography>{" "}
          (ID:{" "}
          <Typography component="span" fontWeight={500}>
            {user?.id}
          </Typography>
          )?
          <Typography>This action will:</Typography>
        </DialogContentText>
        <Stack spacing={1} sx={{ mt: 2, pl: 2 }}>
          {consequences.map((item, index) => (
            <Box key={index} display="flex" alignItems="flex-start">
              <Typography component="span" color={actionColor} fontWeight="bold" sx={{ mr: 1 }}>
                •
              </Typography>
              <Typography variant="body2">{item}</Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" variant="outlined" sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={isActive ? handleConfirmDeactivate : handleConfirmActivate}
          color={isActive ? "error" : "success"}
          variant="contained"
          sx={{ textTransform: "none" }}
          startIcon={icon}
        >
          Confirm {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
