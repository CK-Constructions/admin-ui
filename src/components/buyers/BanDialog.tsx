import { FaBan, FaCheckCircle } from "react-icons/fa";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TUser } from "../lib/types/response";
import { Box, Stack, Typography } from "@mui/material";
import { queryConfigs } from "../../query/queryConfig";
import { useMutationQuery } from "../../query/hooks/queryHook";
import { showNotification } from "../utils/utils";

type BanDialogProps = {
  open: boolean;
  onClose: () => void;
  user: TUser;
  isBanned: boolean;
};

export function BanDialog({ open, onClose, user, isBanned }: BanDialogProps) {
  const { mutationFn: banFunc, invalidateKey } = queryConfigs.useBanUser;
  const { mutationFn: unbanFunc, invalidateKey: unbanKey } = queryConfigs.useUnBanUser;

  const handleConfirmBan = () => {
    if (user.id) {
      banMutate({ id: user.id });
    } else {
      showNotification("error", "User ID is Missing, Try Again");
    }
  };

  const handleConfirmUnban = () => {
    if (user.id) {
      unbanMutate({ id: user.id });
    } else {
      showNotification("error", "User ID is Missing, Try Again");
    }
  };

  const { mutate: banMutate } = useMutationQuery({
    invalidateKey: invalidateKey,
    func: banFunc,
    onSuccess: () => {
      showNotification("success", "User Banned Successfully");
      onClose();
    },
  });

  const { mutate: unbanMutate } = useMutationQuery({
    invalidateKey: unbanKey,
    func: unbanFunc,
    onSuccess: () => {
      showNotification("success", "User Unbanned Successfully");
      onClose();
    },
  });

  const banConsequences = ["Revoke all account access", "Remove user permissions", "Require admin approval to reinstate"];
  const unbanConsequences = ["Restore all account access", "Reinstate user permissions", "User will be able to login immediately"];
  const consequences = isBanned ? unbanConsequences : banConsequences;
  const action = isBanned ? "Unban" : "Ban";
  const actionColor = isBanned ? "success.main" : "error.main";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="ban-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 400,
        },
      }}
    >
      <DialogTitle
        id="ban-dialog-title"
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
        Confirm Vendor {action}
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <DialogContentText sx={{ mt: 3 }}>
          Are you sure you want to {action.toLowerCase()}{" "}
          <Typography component="span" fontWeight={600} color={actionColor}>
            {user?.fullname || "this user"}
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
        <Button onClick={onClose} color="primary" variant="outlined" sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        {isBanned ? (
          <Button onClick={handleConfirmUnban} color="success" variant="contained" sx={{ textTransform: "none" }} startIcon={<FaCheckCircle />}>
            Confirm Unban
          </Button>
        ) : (
          <Button onClick={handleConfirmBan} color="error" variant="contained" sx={{ textTransform: "none" }} startIcon={<FaBan />}>
            Confirm Ban
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
