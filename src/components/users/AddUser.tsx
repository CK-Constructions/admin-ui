import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Stack, Avatar } from "@mui/material";
import { styled } from "@mui/system";
import { TUserFormData } from "../lib/types/payloads";
import { queryConfigs } from "../../query/queryConfig";
import { useMutationQuery } from "../../query/hooks/queryHook";
import { showNotification } from "../utils/utils";
import { uploadMedia } from "../../api";

// Type definitions for form data

// Props type for the component
interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TUserFormData) => void;
}

// Styled modal box
const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  backgroundColor: "white",
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const AddUser: React.FC<AddUserModalProps> = ({ open, onClose, onSubmit }) => {
  const { mutationFn, queryKey } = queryConfigs.useAddAdmin;

  const { mutate: addSupport } = useMutationQuery({
    invalidateKey: queryKey,
    func: mutationFn,
    onSuccess: () => {
      showNotification("success", "Support Added Successfully");
      onClose();
    },
  });

  const [formData, setFormData] = useState<TUserFormData>({
    username: "",
    fullname: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setFormData((prev) => ({
  //       ...prev,
  //       image: file,
  //     }));

  //     // Create preview
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreviewImage(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const response = await uploadMedia(file);

        const mediaId = response.data.id;
        setFormData((prev) => ({
          ...prev,
          image: mediaId,
        }));

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error(error);
        showNotification("error", "Failed to upload image");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!formData.username.trim()) {
      showNotification("error", "Username is required");
      return;
    }

    if (!formData.fullname.trim()) {
      showNotification("error", "Full name is required");
      return;
    }

    if (!formData.email.trim()) {
      showNotification("error", "Email is required");
      return;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      showNotification("error", "Please enter a valid email address");
      return;
    }

    if (!formData.phone.trim()) {
      showNotification("error", "Phone number is required");
      return;
    }

    if (!formData.password) {
      showNotification("error", "Password is required");
      return;
    } else if (formData.password.length < 6) {
      showNotification("error", "Password must be at least 6 characters");
      return;
    }

    // If all validations pass, submit the form
    addSupport(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      username: "",
      fullname: "",
      address: "",
      phone: "",
      email: "",
      password: "",
      image: null,
    });
    setPreviewImage(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <StyledBox>
        <Typography variant="h6" component="h2" mb={3} className="text-center">
          Add New User
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box display="flex" justifyContent="center">
              <label htmlFor="image-upload">
                <input accept="image/*" id="image-upload" type="file" style={{ display: "none" }} onChange={handleImageChange} />
                <Avatar src={previewImage || undefined} sx={{ width: 150, height: 150, cursor: "pointer" }} />
              </label>
            </Box>

            <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" alignItems="center" sx={{ width: "100%" }}>
              {/* Full Name - full width */}
              <TextField label="Full Name" name="fullname" value={formData.fullname} onChange={handleChange} required sx={{ width: "100%" }} />

              {/* First row of half-width fields */}
              <Box display="flex" gap={2} sx={{ width: "100%" }}>
                <TextField label="Username" name="username" value={formData.username} onChange={handleChange} required sx={{ flex: 1 }} />
                <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required sx={{ flex: 1 }} />
              </Box>

              {/* Second row of half-width fields */}
              <Box display="flex" gap={2} sx={{ width: "100%" }}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ flex: 1 }}
                />
                <TextField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} sx={{ flex: 1 }} />
              </Box>

              {/* Address - full width */}
              <TextField label="Address" name="address" value={formData.address} onChange={handleChange} multiline rows={2} sx={{ width: "100%" }} />
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </StyledBox>
    </Modal>
  );
};

export default AddUser;
