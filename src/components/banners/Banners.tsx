import { useState, useEffect } from 'react';
import { Box, Button, Checkbox, Chip, Modal, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { FaBan, FaCheck, FaSearchMinus, FaSearchPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { MdOutlineAddToPhotos } from 'react-icons/md';
import { BsUniversalAccessCircle } from 'react-icons/bs';

import Header from '../common/Header';
import { BannerStatusModal } from '../buyers/ActiveBannerModal';

import { useNavigate } from 'react-router-dom';
import { uploadFileToS3 } from '../../api';
import { showNotification } from '../utils/utils';
import { useGetQuery, useMutationQuery } from '../../query/hooks/queryHook';
import { queryConfigs } from '../../query/queryConfig';

import type { TBanner, TBannerBody } from '../lib/types/common';

const LIMIT = 10;
const DEFAULT_SCALE = 1;

const Banners = () => {
	const navigate = useNavigate();

	// Pagination & Data
	const [page, setPage] = useState(1);

	const { queryFn: getAllBanners, queryKeys: bannersKey } = queryConfigs.useGetAllBanners;

	const {
		data,
		refetch,
		isLoading: isLoadingBanners,
		isRefetching,
	} = useGetQuery({
		func: getAllBanners,
		key: bannersKey,
		params: {
			offset: (page - 1) * LIMIT,
			limit: LIMIT,
		},
	});

	// Add Banner Modal
	const [openAddModal, setOpenAddModal] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [bannerForm, setBannerForm] = useState<TBannerBody>({
		image: undefined,
		title: '',
		description: '',
		path: '',
	});

	// Status Change Modal
	const [statusModal, setStatusModal] = useState<{
		open: boolean;
		banner: TBanner | null;
		willActivate: boolean;
	}>({
		open: false,
		banner: null,
		willActivate: false,
	});

	// Fullscreen Viewer
	const [viewer, setViewer] = useState<{
		open: boolean;
		banner: TBanner | null;
		scale: number;
	}>({
		open: false,
		banner: null,
		scale: DEFAULT_SCALE,
	});

	// Multi-select mode
	const [selectMode, setSelectMode] = useState(false);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);

	// Mutations
	const { mutate: addBanner, isPending: isAdding } = useMutationQuery({
		invalidateKey: bannersKey,
		func: queryConfigs.useAddBanner.queryFn,
		onSuccess: () => {
			showNotification('success', 'Banner created successfully');
			handleCloseAddModal();
		},
	});

	const { mutate: enableBanner } = useMutationQuery({
		invalidateKey: bannersKey,
		func: queryConfigs.useEnableBanner.queryFn,
		onSuccess: () => showNotification('success', 'Banner activated'),
	});

	const { mutate: disableBanner } = useMutationQuery({
		invalidateKey: bannersKey,
		func: queryConfigs.useDisableBanner.queryFn,
		onSuccess: () => showNotification('success', 'Banner deactivated'),
	});

	// Handlers
	const handleImageChange = async (file?: File) => {
		if (!file) return;

		const objectUrl = URL.createObjectURL(file);
		setPreviewUrl(objectUrl);

		try {
			const publicUrl = await uploadFileToS3(file);
			setBannerForm((prev) => ({ ...prev, image: publicUrl }));
		} catch (err) {
			showNotification('error', 'Failed to upload image');
			setPreviewUrl(null);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setBannerForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmitBanner = () => {
		if (!bannerForm.image) {
			showNotification('warning', 'Please upload an image first');
			return;
		}
		if (!bannerForm.title?.trim()) {
			showNotification('warning', 'Title is required');
			return;
		}

		addBanner(bannerForm);
	};

	const handleCloseAddModal = () => {
		setOpenAddModal(false);
		setPreviewUrl(null);
		setBannerForm({
			image: undefined,
			title: '',
			description: '',
			path: '',
		});
	};

	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	const openStatusModal = (banner: TBanner, willActivate: boolean) => {
		setStatusModal({ open: true, banner, willActivate });
	};

	const handleImageClick = (banner: TBanner) => {
		if (selectMode) {
			setSelectedIds((prev) => (prev.includes(banner.id) ? prev.filter((id) => id !== banner.id) : [...prev, banner.id]));
		} else {
			setViewer({ open: true, banner, scale: DEFAULT_SCALE });
		}
	};

	const zoomIn = () => setViewer((p) => ({ ...p, scale: Math.min(p.scale + 0.15, 2.5) }));
	const zoomOut = () => setViewer((p) => ({ ...p, scale: Math.max(p.scale - 0.15, 0.4) }));

	const isActive = (banner: TBanner) => banner.is_active === 0;

	return (
		<div className="p-5 max-w-[1800px] mx-auto">
			<Header
				onBackClick={() => navigate(-1)}
				onReloadClick={refetch}
				showButton
				buttonTitle="Add New Banner"
				pageName="Banner Management"
				buttonFunc={() => setOpenAddModal(true)}
			/>

			{/* Controls */}
			<div className="flex flex-wrap items-center justify-between gap-4 my-6">
				<div className="flex items-center gap-4">
					<Button variant="outlined" size="small" startIcon={<FaSearchMinus />} onClick={zoomOut} disabled={viewer.open}>
						Zoom Out
					</Button>
					<span className="text-sm text-gray-600 min-w-[90px]">Grid zoom: {Math.round(viewer.scale * 100)}%</span>
					<Button variant="outlined" size="small" startIcon={<FaSearchPlus />} onClick={zoomIn} disabled={viewer.open}>
						Zoom In
					</Button>
				</div>

				<Button
					variant={selectMode ? 'contained' : 'outlined'}
					color={selectMode ? 'success' : 'inherit'}
					startIcon={selectMode ? <FaCheck /> : <FaTrash />}
					onClick={() => {
						setSelectMode(!selectMode);
						if (selectMode) setSelectedIds([]);
					}}
				>
					{selectMode ? 'Exit Selection' : 'Select Mode'}
				</Button>
			</div>

			{/* Banner Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{data?.result?.list?.map((banner: TBanner) => (
					<div
						key={banner.id}
						className={`
              relative rounded-xl overflow-hidden border shadow-sm transition-all duration-200
              ${selectMode ? 'hover:ring-2 hover:ring-blue-400' : 'hover:shadow-xl cursor-pointer'}
              ${selectMode && selectedIds.includes(banner.id) ? 'ring-2 ring-green-500 bg-green-50/30' : ''}
            `}
						style={{ aspectRatio: '390 / 480' }}
						onClick={() => handleImageClick(banner)}
					>
						{selectMode && (
							<Checkbox
								checked={selectedIds.includes(banner.id)}
								onChange={() => {}}
								onClick={(e) => e.stopPropagation()}
								sx={{
									position: 'absolute',
									top: 12,
									left: 12,
									bgcolor: 'white',
									zIndex: 10,
									'&.Mui-checked': { color: '#22c55e' },
								}}
							/>
						)}

						<img
							src={banner.image}
							alt={banner.title || 'Banner'}
							className="w-full h-[260px] object-cover"
							style={{ opacity: selectMode && selectedIds.includes(banner.id) ? 0.75 : 1 }}
						/>

						<div className="p-4 space-y-2.5 bg-white">
							<Chip
								label={isActive(banner) ? 'Active' : 'Inactive'}
								color={isActive(banner) ? 'success' : 'error'}
								size="small"
								variant="outlined"
							/>

							<div>
								<Typography variant="subtitle2" noWrap>
									{banner.title || '—'}
								</Typography>
								<Typography variant="caption" color="text.secondary" noWrap>
									{banner.path || '—'}
								</Typography>
							</div>

							<Typography variant="caption" color="text.secondary" className="line-clamp-2 min-h-[2.5em]">
								{banner.description || 'No description'}
							</Typography>

							<Typography variant="caption" color="text.disabled">
								Created: {new Date(banner.created_on).toLocaleDateString()}
							</Typography>

							<div className="pt-3 flex gap-2">
								{isActive(banner) ? (
									<Tooltip title="Deactivate this banner">
										<Button
											size="small"
											color="error"
											variant="outlined"
											startIcon={<FaBan />}
											onClick={(e) => {
												e.stopPropagation();
												openStatusModal(banner, false);
											}}
										>
											Disable
										</Button>
									</Tooltip>
								) : (
									<Tooltip title="Activate this banner">
										<Button
											size="small"
											color="success"
											variant="outlined"
											startIcon={<BsUniversalAccessCircle />}
											onClick={(e) => {
												e.stopPropagation();
												openStatusModal(banner, true);
											}}
										>
											Activate
										</Button>
									</Tooltip>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Fullscreen Viewer Modal */}
			<Modal open={viewer.open} onClose={() => setViewer({ open: false, banner: null, scale: DEFAULT_SCALE })}>
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						bgcolor: 'rgba(0,0,0,0.92)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						p: 2,
					}}
				>
					<div className="relative max-w-[95vw] max-h-[95vh]">
						{viewer.banner && (
							<img
								src={viewer.banner.image}
								alt={viewer.banner.title}
								style={{
									transform: `scale(${viewer.scale})`,
									transition: 'transform 0.18s ease',
									maxWidth: '100%',
									maxHeight: '90vh',
									objectFit: 'contain',
								}}
							/>
						)}

						<div className="absolute top-4 right-4 flex gap-3">
							<Button variant="contained" size="small" onClick={zoomOut} sx={{ minWidth: 42, bgcolor: 'rgba(255,255,255,0.25)' }}>
								<FaSearchMinus />
							</Button>
							<Button variant="contained" size="small" onClick={zoomIn} sx={{ minWidth: 42, bgcolor: 'rgba(255,255,255,0.25)' }}>
								<FaSearchPlus />
							</Button>
							<Button
								variant="contained"
								color="error"
								size="small"
								onClick={() => setViewer({ open: false, banner: null, scale: DEFAULT_SCALE })}
								sx={{ minWidth: 42 }}
							>
								<FaTimes />
							</Button>
						</div>
					</div>
				</Box>
			</Modal>

			{/* Add Banner Modal */}
			<Modal open={openAddModal} onClose={handleCloseAddModal}>
				<Paper
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: { xs: '92%', sm: 620 },
						maxHeight: '94vh',
						overflowY: 'auto',
						p: 4,
						borderRadius: 2,
					}}
				>
					<Typography variant="h5" gutterBottom>
						Create New Banner
					</Typography>

					{/* Upload Zone */}
					<Box
						onClick={() => document.getElementById('banner-file-input')?.click()}
						onDrop={(e) => {
							e.preventDefault();
							handleImageChange(e.dataTransfer.files?.[0]);
						}}
						onDragOver={(e) => e.preventDefault()}
						sx={{
							border: '2px dashed',
							borderColor: previewUrl ? 'primary.main' : 'grey.400',
							borderRadius: 2,
							p: 5,
							textAlign: 'center',
							mb: 4,
							cursor: 'pointer',
							transition: 'all 0.2s',
							'&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
						}}
					>
						<input
							id="banner-file-input"
							type="file"
							accept="image/*"
							onChange={(e) => handleImageChange(e.target.files?.[0])}
							style={{ display: 'none' }}
						/>

						{previewUrl ? (
							<Box sx={{ position: 'relative', mx: 'auto', maxWidth: '100%' }}>
								<img
									src={previewUrl}
									alt="Preview"
									style={{
										maxHeight: 280,
										maxWidth: '100%',
										objectFit: 'contain',
										borderRadius: 8,
									}}
								/>
								<Button
									size="small"
									color="error"
									variant="outlined"
									sx={{ position: 'absolute', top: 12, right: 12 }}
									onClick={(e) => {
										e.stopPropagation();
										setPreviewUrl(null);
										setBannerForm((p) => ({ ...p, image: undefined }));
									}}
								>
									Remove
								</Button>
							</Box>
						) : (
							<Stack alignItems="center" spacing={2} py={8}>
								<MdOutlineAddToPhotos size={64} color="#9ca3af" />
								<Typography variant="body1" color="text.secondary">
									Click or drag & drop banner image here
								</Typography>
								<Typography variant="caption" color="text.disabled">
									Recommended: 1920×600 or similar wide aspect ratio
								</Typography>
							</Stack>
						)}
					</Box>

					<Stack spacing={3}>
						<TextField
							required
							fullWidth
							label="Banner Title"
							name="title"
							value={bannerForm.title}
							onChange={handleInputChange}
							variant="outlined"
						/>

						<TextField
							fullWidth
							multiline
							rows={3}
							label="Description (optional)"
							name="description"
							value={bannerForm.description}
							onChange={handleInputChange}
							variant="outlined"
						/>

						<TextField
							fullWidth
							label="Redirect Path / URL (optional)"
							name="path"
							value={bannerForm.path}
							onChange={handleInputChange}
							placeholder="/sale/special-offer"
							variant="outlined"
						/>
					</Stack>

					<Stack direction="row" justifyContent="flex-end" spacing={2} mt={5}>
						<Button variant="outlined" onClick={handleCloseAddModal}>
							Cancel
						</Button>
						<Button variant="contained" onClick={handleSubmitBanner} disabled={isAdding || !bannerForm.image || !bannerForm.title?.trim()}>
							{isAdding ? 'Creating...' : 'Create Banner'}
						</Button>
					</Stack>
				</Paper>
			</Modal>

			{/* Status Confirmation Modal */}
			{statusModal.banner && (
				<BannerStatusModal
					open={statusModal.open}
					onClose={() => setStatusModal((p) => ({ ...p, open: false }))}
					user={statusModal.banner}
					isActive={statusModal.willActivate}
					onConfirm={() => (statusModal.willActivate ? enableBanner(statusModal.banner?.id) : disableBanner(statusModal.banner?.id))}
				/>
			)}
		</div>
	);
};

export default Banners;
