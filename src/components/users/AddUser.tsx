import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, Avatar } from '@mui/material';
import { styled } from '@mui/system';

import { TUserFormData } from '../lib/types/payloads';
import { queryConfigs } from '../../query/queryConfig';
import { useMutationQuery } from '../../query/hooks/queryHook';
import { showNotification } from '../utils/utils';
import { uploadFileToS3 } from '../../api';

/* =======================
   Props
======================= */
interface AddUserModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit?: (data: TUserFormData) => void;
}

/* =======================
   Styled Components
======================= */
const StyledBox = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 800,
	backgroundColor: '#fff',
	padding: theme.spacing(4),
	borderRadius: theme.shape.borderRadius,
}));

/* =======================
   Component
======================= */
const AddUser: React.FC<AddUserModalProps> = ({ open, onClose }) => {
	const { mutationFn, queryKey } = queryConfigs.useAddAdmin;

	const { mutate: addSupport } = useMutationQuery({
		func: mutationFn,
		invalidateKey: queryKey,
		onSuccess: () => {
			showNotification('success', 'Support added successfully');
			handleClose();
		},
	});

	/* =======================
	   State
	======================= */
	const [formData, setFormData] = useState<TUserFormData>({
		username: '',
		fullname: '',
		address: '',
		phone: '',
		email: '',
		password: '',
		image: '',
	});

	const [previewImage, setPreviewImage] = useState<string | null>(null);

	/* =======================
	   Handlers
	======================= */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.[0]) return;

		const file = e.target.files[0];

		try {
			const mediaId = await uploadFileToS3(file); // ✅ string

			setFormData((prev) => ({
				...prev,
				image: mediaId,
			}));

			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		} catch (error) {
			console.error(error);
			showNotification('error', 'Image upload failed');
		}
	};

	const validateForm = (): boolean => {
		if (!formData.fullname.trim()) {
			showNotification('error', 'Full name is required');
			return false;
		}
		if (!formData.username.trim()) {
			showNotification('error', 'Username is required');
			return false;
		}
		if (!formData.email.trim()) {
			showNotification('error', 'Email is required');
			return false;
		}
		if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
			showNotification('error', 'Invalid email format');
			return false;
		}
		if (!formData.phone.trim()) {
			showNotification('error', 'Phone number is required');
			return false;
		}
		if (!formData.password || formData.password.length < 6) {
			showNotification('error', 'Password must be at least 6 characters');
			return false;
		}
		return true;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		addSupport(formData);
	};

	const handleClose = () => {
		setFormData({
			username: '',
			fullname: '',
			address: '',
			phone: '',
			email: '',
			password: '',
			image: '',
		});
		setPreviewImage(null);
		onClose();
	};

	/* =======================
	   Render
	======================= */
	return (
		<Modal open={open} onClose={handleClose}>
			<StyledBox>
				<Typography variant="h6" mb={3} textAlign="center">
					Add New User
				</Typography>

				<form onSubmit={handleSubmit}>
					<Stack spacing={3}>
						<Box display="flex" justifyContent="center">
							<label htmlFor="image-upload">
								<input id="image-upload" type="file" accept="image/*" hidden onChange={handleImageChange} />
								<Avatar src={previewImage ?? undefined} sx={{ width: 140, height: 140, cursor: 'pointer' }} />
							</label>
						</Box>

						<TextField label="Full Name" name="fullname" value={formData.fullname} onChange={handleChange} fullWidth required />

						<Box display="flex" gap={2}>
							<TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth required />
							<TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required />
						</Box>

						<Box display="flex" gap={2}>
							<TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required />
							<TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
						</Box>

						<TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth multiline rows={2} />

						<Stack direction="row" spacing={2} justifyContent="center">
							<Button type="submit" variant="contained">
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
