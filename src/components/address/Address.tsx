import React, { useState } from 'react';
import {
	Box,
	Typography,
	Chip,
	IconButton,
	Menu,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Pagination,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { Edit, Trash2, MoreVerticalIcon } from 'lucide-react';
import { queryConfigs } from '../../query/queryConfig';
import { useGetQuery } from '../../query/hooks/queryHook';
import { showNotification } from '../utils/utils';

interface AddressType {
	id: number;
	user_id: number;
	full_name: string;
	mobile: string;
	alternate_mobile: string;
	address: string;
	locality: string;
	landmark: string;
	pincode: string;
	type: string;
}

const Address = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const limit = 10;
	const [currentPage, setCurrentPage] = useState(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null);

	const { queryFn: addressFunc, queryKey: addressKey } = queryConfigs.useGetAddress;

	const { data, isLoading, isFetching, isError } = useGetQuery({
		func: addressFunc,
		key: addressKey,
		params: { limit, offset: (currentPage - 1) * limit },
	});

	const addresses: AddressType[] = Array.isArray(data?.result?.list) ? data?.result.list : Array.isArray(data) ? data : [];

	const totalCount = data?.result?.count ?? addresses.length;
	const totalPages = Math.ceil(totalCount / limit);

	const open = Boolean(anchorEl);

	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, addr: AddressType) => {
		setAnchorEl(event.currentTarget);
		setSelectedAddress(addr);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedAddress(null);
	};

	const handleAction = (action: 'edit' | 'delete') => {
		if (!selectedAddress) return;

		switch (action) {
			case 'edit':
				showNotification('info', 'Edit feature coming soon');
				break;
			case 'delete':
				showNotification('success', `Address deleted: ${selectedAddress.full_name}`);
				break;
		}
		handleMenuClose();
	};

	if (isLoading || isFetching) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<Typography>Loading addresses...</Typography>
			</Box>
		);
	}

	if (isError) {
		return (
			<Box textAlign="center" py={5}>
				<Typography color="error">Failed to load addresses</Typography>
			</Box>
		);
	}

	if (addresses.length === 0) {
		return (
			<Box textAlign="center" py={10}>
				<Typography variant="h6" color="textSecondary">
					No addresses found
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
			<Typography variant="h5" fontWeight="bold" mb={3}>
				My Addresses ({totalCount})
			</Typography>

			{/* Desktop Table */}
			{!isMobile && (
				<TableContainer component={Paper} sx={{ flexGrow: 1, maxHeight: 600 }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								{['Name & Mobile', 'User_ID', 'Full Address', 'Type', 'Actions'].map((h) => (
									<TableCell
										key={h}
										sx={{
											backgroundColor: 'black',
											color: 'white',
											fontWeight: 'bold',
											fontSize: '0.95rem',
										}}
									>
										{h}
									</TableCell>
								))}
							</TableRow>
						</TableHead>

						<TableBody>
							{addresses.map((addr) => (
								<TableRow key={addr.id} hover>
									<TableCell>
										<Typography fontWeight="medium">{addr.full_name}</Typography>
										<Typography variant="body2" color="text.secondary">
											{addr.mobile}
											{addr.alternate_mobile && addr.alternate_mobile !== 'das' ? ` | ${addr.alternate_mobile}` : ''}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography fontWeight="medium">{addr.user_id}</Typography>
									</TableCell>

									<TableCell>
										{addr.address}
										{addr.landmark && addr.landmark !== 'das' && `, Near ${addr.landmark}`}, {addr.locality}, {addr.pincode}
									</TableCell>

									<TableCell>
										<Chip label={addr.type} size="small" color={addr.type === 'home' ? 'primary' : 'secondary'} variant="outlined" />
									</TableCell>

									<TableCell>
										<IconButton size="small" onClick={(e) => handleMenuClick(e, addr)}>
											<MoreVerticalIcon size={18} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			{/* Mobile Cards */}
			{isMobile && (
				<Box sx={{ flexGrow: 1 }}>
					{addresses.map((addr) => (
						<Paper key={addr.id} sx={{ p: 2, mb: 2 }}>
							<Box display="flex" justifyContent="space-between">
								<Box>
									<Typography fontWeight="bold">{addr.full_name}</Typography>
									<Typography variant="body2" color="text.secondary">
										{addr.mobile}
										{addr.alternate_mobile && addr.alternate_mobile !== 'das' ? ` | ${addr.alternate_mobile}` : ''}
									</Typography>
								</Box>

								<IconButton size="small" onClick={(e) => handleMenuClick(e, addr)}>
									<MoreVerticalIcon />
								</IconButton>
							</Box>

							<Typography variant="body2" mt={1} color="text.secondary">
								{addr.address}
								{addr.landmark && addr.landmark !== 'das' && `, Near ${addr.landmark}`}
								<br />
								{addr.locality}, {addr.pincode}
							</Typography>

							<Chip label={addr.type} size="small" color={addr.type === 'home' ? 'primary' : 'secondary'} sx={{ mt: 1 }} />
						</Paper>
					))}
				</Box>
			)}

			{/* Action Menu */}
			<Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
				<MenuItem onClick={() => handleAction('edit')}>
					<Edit size={16} style={{ marginRight: 8 }} /> Edit Address
				</MenuItem>

				<MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
					<Trash2 size={16} style={{ marginRight: 8 }} /> Delete Address
				</MenuItem>
			</Menu>

			{/* Pagination */}
			{totalPages > 1 && (
				<Box display="flex" justifyContent="center" mt={3}>
					<Pagination count={totalPages} page={currentPage} onChange={(_, v) => setCurrentPage(v)} color="primary" />
				</Box>
			)}
		</Box>
	);
};

export default Address;
