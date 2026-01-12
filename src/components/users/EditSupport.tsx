import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Avatar, Divider, IconButton, Paper, Stack, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery, useMutationQuery } from '../../query/hooks/queryHook';
import { showNotification } from '../utils/utils';
import { TUserFormData } from '../lib/types/payloads';
import { uploadFileToS3 } from '../../api';

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
}

const EditSupport: React.FC<EditSupportProps> = ({ open, onClose, userid, onSuccess }) => {
	const { queryFn: getUserById, queryKey } = queryConfigs.useGetAdminById;
	const { mutationFn: updateUser, invalidateKey } = queryConfigs.useUpdateAdmin;

	/* ---------------------- Fetch User ---------------------- */
	const { data } = useGetQuery({
		func: getUserById,
		key: queryKey,
		params: { id: userid },
		isEnabled: Boolean(userid),
	});

	/* ---------------------- Update User --------------------- */
	const { mutate, isPending } = useMutationQuery({
		func: updateUser,
		invalidateKey,
		onSuccess() {
			showNotification('success', 'Support user updated successfully');
			onSuccess?.();
			onClose();
		},
	});

	/* ---------------------- State --------------------------- */
	const [values, setValues] = useState<TUserFormData>({
		fullname: '',
		username: '',
		email: '',
		phone: '',
		address: '',
		image: '',
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [previewImage, setPreviewImage] = useState<string | null>(null);

	/* ---------------------- Populate Data ------------------- */
	useEffect(() => {
		if (!data?.result) return;

		setValues({
			fullname: data.result.fullname ?? '',
			username: data.result.username ?? '',
			email: data.result.email ?? '',
			phone: data.result.phone ?? '',
			address: data.result.address ?? '',
			image: data.result.image ?? '',
		});

		setPreviewImage(data.result.image ?? null);
	}, [data]);

	/* ---------------------- Validation ---------------------- */
	const validate = (): boolean => {
		const newErrors: FormErrors = {};

		if (!values.fullname.trim()) newErrors.fullname = 'Full name is required';

		if (!values.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
			newErrors.email = 'Invalid email format';
		}

		if (!values.phone.trim()) {
			newErrors.phone = 'Phone number is required';
		} else if (!/^[0-9]+$/.test(values.phone)) {
			newErrors.phone = 'Only digits allowed';
		}

		if (!values.address.trim()) newErrors.address = 'Address is required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	/* ---------------------- Handlers ------------------------ */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.[0]) return;

		try {
			const file = e.target.files[0];
			const publicUrl = await uploadFileToS3(file);

			setValues((prev) => ({ ...prev, image: publicUrl }));
			setPreviewImage(publicUrl);
		} catch (error) {
			console.error(error);
			showNotification('error', 'Image upload failed');
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		mutate({
			id: userid,
			body: values,
		});
	};

	/* ---------------------- UI ------------------------------ */
	return (
		<Modal open={open} onClose={onClose}>
			<Box
				component={Paper}
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: { xs: '90%', sm: 600 },
					p: 4,
					borderRadius: 2,
					outline: 'none',
				}}
			>
				<IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
					<CloseIcon />
				</IconButton>

				<form onSubmit={handleSubmit}>
					<Stack spacing={3} alignItems="center">
						<Avatar src={previewImage || undefined} sx={{ width: 120, height: 120, fontSize: 48 }}>
							{!previewImage && values.username?.charAt(0).toUpperCase()}
						</Avatar>

						<input type="file" id="image" hidden accept="image/*" onChange={handleImageChange} />

						<label htmlFor="image">
							<Button component="span" variant="outlined">
								Upload Image
							</Button>
						</label>

						<Typography variant="h5">Edit User Details</Typography>

						<Divider flexItem />

						<Stack spacing={2} width="100%">
							<TextField
								name="fullname"
								label="Full Name"
								value={values.fullname}
								onChange={handleChange}
								error={!!errors.fullname}
								helperText={errors.fullname}
								fullWidth
							/>

							<TextField name="username" label="Username" value={values.username} disabled fullWidth />

							<TextField
								name="email"
								label="Email"
								value={values.email}
								onChange={handleChange}
								error={!!errors.email}
								helperText={errors.email}
								fullWidth
							/>

							<TextField
								name="phone"
								label="Phone"
								value={values.phone}
								onChange={handleChange}
								error={!!errors.phone}
								helperText={errors.phone}
								fullWidth
							/>

							<TextField
								name="address"
								label="Address"
								value={values.address}
								onChange={handleChange}
								error={!!errors.address}
								helperText={errors.address}
								multiline
								rows={3}
								fullWidth
							/>
						</Stack>

						<Box display="flex" justifyContent="flex-end" width="100%" gap={2}>
							<Button variant="outlined" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" variant="contained" disabled={isPending}>
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
