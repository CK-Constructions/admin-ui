import { FaBan } from "react-icons/fa";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TUser } from "../lib/types/response";
import { Box, Stack, Typography } from "@mui/material";

type BanDialogProps = {
  open: boolean;
  onClose: () => void;
  user: TUser;
  onConfirm: (userId: string | number) => void;
};

export function BanDialog({
  open,
  onClose,
  user,
  onConfirm,
}: BanDialogProps) {
  const handleConfirm = () => {
    onConfirm(user?.id);
  };
  const consequences = [
    "Revoke all account access",
    "Remove user permissions",
    "Require admin approval to reinstate",
  ];
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
          color: "error.main",
          borderBottom: 1,
          borderColor: "divider",
          py: 2,
          px: 3,
        }}
      >
        Confirm User Ban
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <DialogContentText sx={{ mt: 3 }}>
          Are you sure you want to ban{" "}
          <Typography
            component="span"
            fontWeight={600}
            color="error.main"
          >
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
            <Box
              key={index}
              display="flex"
              alignItems="flex-start"
            >
              <Typography
                component="span"
                color="error.main"
                fontWeight="bold"
                sx={{ mr: 1 }}
              >
                •
              </Typography>
              <Typography variant="body2">
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          autoFocus
          sx={{ textTransform: "none" }}
          startIcon={<FaBan />}
        >
          Confirm Ban
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Usage example:
// Parent component would manage the state:
/*
const [banDialogOpen, setBanDialogOpen] = useState(false);

<Button
  startIcon={<FaBan />}
  onClick={() => setBanDialogOpen(true)}
>
  Ban User
</Button>

<BanDialog
  open={banDialogOpen}
  onClose={() => setBanDialogOpen(false)}
  user={{ id: 123, name: "John Doe" }}
  onConfirm={(userId) => {
    console.log("Banning user:", userId);
    setBanDialogOpen(false);
  }}
/>
*/
