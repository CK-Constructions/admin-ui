import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Paper,
  Stack,
  Chip,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TUser } from "../lib/types/response";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery, useMutationQuery } from "../../query/hooks/queryHook";
import { showNotification } from "../utils/utils";
import { TUserFormData } from "../lib/types/payloads";
import { uploadMedia } from "../../api";

interface EditSupportProps {
  open: boolean;
  onClose: () => void;
  userid: number;
  onSuccess?: () => void;
}

interface FormErrors {
  fullname?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
}

const EditSupport: React.FC<EditSupportProps> = ({ open, onClose, userid }) => {
  const { queryFn: UserFunc, queryKey: userKey } = queryConfigs.useGetAdminById;
  const { mutationFn: updateUserFunc, invalidateKey: updateKey } = queryConfigs.useUpdateAdmin;

  const { data } = useGetQuery({
    func: UserFunc,
    key: userKey,
    params: {
      id: userid ?? null,
    },
    isEnabled: userid ? true : false,
  });

  const { mutate } = useMutationQuery({
    func: updateUserFunc,
    invalidateKey: updateKey,

    onSuccess() {
      showNotification("success", "Support User Added Successfully");
      onClose();
    },
  });

  const [values, setValues] = useState<TUserFormData>({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (data?.result) {
      setValues({
        fullname: data.result.fullname || "",
        username: data.result.username || "",
        email: data.result.email || "",
        phone: data.result.phone || "",
        address: data.result.address || "",
        image: data.result.image || "",
      });
      setPreviewImage(`${process.env.REACT_APP_GET_MEDIA}/${data.result.image}`);
    }
  }, [data]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!values.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]+$/.test(values.phone)) {
      newErrors.phone = "Must contain only digits";
    }

    if (!values.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const response = await uploadMedia(file);

        const mediaId = response.data.id;
        setValues((prev) => ({
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

    if (validate()) {
      mutate({
        id: userid,
        body: values,
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="user-edit-modal" aria-describedby="user-details-edit">
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

        <form onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="center">
            <Avatar
              src={previewImage || `${process.env.REACT_APP_GET_MEDIA}/${data?.result?.image}`}
              sx={{
                width: 120,
                height: 120,
                fontSize: 48,
                bgcolor: "primary.main",
                mb: 2,
              }}
            >
              {!data?.result?.image && data?.result?.username.charAt(0).toUpperCase()}
            </Avatar>

            <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            <label htmlFor="image">
              <Button variant="outlined" component="span">
                Upload Image
              </Button>
            </label>

            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
              Edit User Details
            </Typography>

            <Divider flexItem />

            <Stack spacing={2} width="100%">
              <TextField
                fullWidth
                name="fullname"
                label="Full Name"
                value={values.fullname}
                onChange={handleChange}
                error={!!errors.fullname}
                helperText={errors.fullname}
              />

              <TextField fullWidth name="username" label="Username" value={values.username} onChange={handleChange} disabled />

              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                value={values.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />

              <TextField
                fullWidth
                name="address"
                label="Address"
                multiline
                rows={3}
                value={values.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Stack>

            <Box display="flex" justifyContent="flex-end" width="100%" gap={2} mt={3}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default EditSupport;
