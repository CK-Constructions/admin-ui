import { FaBan, FaCheckCircle } from "react-icons/fa";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TAdmin, TListing, TUser } from "../lib/types/response";
import { Box, Stack, Typography } from "@mui/material";
import { queryConfigs } from "../../query/queryConfig";
import { useMutationQuery } from "../../query/hooks/queryHook";
import { showNotification } from "../utils/utils";

type BanDialogProps = {
  open: boolean;
  onClose: () => void;
  user: TListing;
  isBanned: boolean;
};

export function BanListing({ open, onClose, user, isBanned }: BanDialogProps) {
  const { mutationFn: banFunc, queryKey } = queryConfigs.useBanListing;
  const { mutationFn: unbanFunc, queryKey: unbanKey } = queryConfigs.useUnBanListing;

  const handleConfirmBan = () => {
    if (user.id) {
      banMutate({ id: user.id });
    } else {
      showNotification("error", "Listing ID is Missing, Try Again");
    }
  };

  const handleConfirmUnban = () => {
    if (user.id) {
      unbanMutate({ id: user.id });
    } else {
      showNotification("error", "Listing ID is Missing, Try Again");
    }
  };

  const { mutate: banMutate } = useMutationQuery({
    invalidateKey: queryKey,
    func: banFunc,
    onSuccess: () => {
      showNotification("success", "Listing Banned Successfully");
      onClose();
    },
  });

  const { mutate: unbanMutate } = useMutationQuery({
    invalidateKey: unbanKey,
    func: unbanFunc,
    onSuccess: () => {
      showNotification("success", "Listing Unbanned Successfully");
      onClose();
    },
  });

  const banConsequences = [
    "Listing will be disabled and hidden from public view",
    "Clients will no longer be able to view or interact with the listing",
    "The listing will require admin approval to be reinstated",
  ];

  const unbanConsequences = [
    "Restore the listing to its active state, making it visible to clients again",
    "Reinstate the seller's access to the listing, allowing them to manage it",
  ];

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
            {/* Listing {user?.fullname || "this user"} */}
            this listing
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
