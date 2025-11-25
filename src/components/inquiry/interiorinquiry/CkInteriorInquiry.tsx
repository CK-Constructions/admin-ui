import React, { useState } from 'react';
import { queryConfigs } from '../../../query/queryConfig';
import { useGetQuery } from '../../../query/hooks/queryHook';
import { Box, Typography, Pagination } from '@mui/material';
import { countStyle } from '../../vendors/Vendors';
import Header from '../../common/Header';
import { useNavigate } from 'react-router';
import { MdOutlineEmail } from 'react-icons/md';
import { FaPhone } from 'react-icons/fa';
import Loading from '../../common/Loader';
import { sanitizeValue } from '../../utils/utils';

// Define the new CKInquiry type
export interface TCKInquiry {
	id?: number;
	full_name?: string;
	email?: string;
	mobile?: string;
	comment?: string;
	created_on?: string;
}

const CkInteriorInquiry = () => {
	const navigate = useNavigate();
	const { queryFn, queryKey } = queryConfigs.useGetCKInteriorInquiry;

	const limit = 10;
	const [currentPage, setCurrentPage] = useState(1);

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		event.preventDefault();
		setCurrentPage(value);
	};

	const {
		data,
		isLoading,
		isError: isLoadingError,
		isFetching,
		isRefetching,
		isRefetchError,
	} = useGetQuery({
		func: queryFn,
		key: queryKey,
		params: {
			limit,
			offset: (currentPage - 1) * limit,
		},
	});

	const formatDate = (dateString?: string) => {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleString();
	};

	if (isLoading || isFetching || isRefetching) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
				<Loading />
			</Box>
		);
	}

	if (isLoadingError || isRefetchError) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
				<Typography color="error">Error loading inquiries. Please try again.</Typography>
			</Box>
		);
	}

	if (!data || !data.result || !data.result.list || data.result.list.length === 0) {
		return (
			<Box display="flex" flexDirection="column" height="100%">
				<div className="pb-4">
					<Header onBackClick={() => navigate(-1)} pageName="CK Interior Inquiries" />
				</div>
				<Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
					<Typography>No inquiries found</Typography>
				</Box>
			</Box>
		);
	}

	return (
		<div className="space-y-4">
			<div className="pb-4">
				<Header onBackClick={() => navigate(-1)} pageName="CK Interior Inquiries" />
			</div>

			<div className="text-sm text-gray-500">
				Showing {data.result.list.length} of {data.result.count} inquiries
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{data.result.list.map((inquiry: TCKInquiry) => (
					<div
						key={inquiry.id}
						className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
					>
						<div className="flex justify-between items-start mb-3">
							<h3 className="font-semibold text-lg text-gray-800 truncate">{inquiry.full_name || 'Unknown'}</h3>
							<span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{formatDate(inquiry.created_on)}</span>
						</div>

						<div className="space-y-3">
							<div className="flex items-start">
								<MdOutlineEmail className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
								<div>
									<p className="text-xs font-medium text-gray-500">Email</p>
									<a href={`mailto:${inquiry.email}`} className="text-sm text-blue-600 hover:underline truncate block">
										{inquiry.email || 'N/A'}
									</a>
								</div>
							</div>

							<div className="flex items-start">
								<FaPhone className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
								<div>
									<p className="text-xs font-medium text-gray-500">Phone</p>
									<a href={`tel:${inquiry.mobile}`} className="text-sm text-gray-700 hover:text-blue-600">
										{inquiry.mobile || 'N/A'}
									</a>
								</div>
							</div>

							<div className="pt-2 border-t border-gray-100">
								<p className="text-xs font-medium text-gray-500 mb-1">Comment</p>
								<p className="text-sm text-gray-600 whitespace-pre-line">{inquiry.comment || 'No comment'}</p>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="flex items-center justify-center mt-5">
				<div className="flex items-center justify-end space-x-3">
					{sanitizeValue(data?.result?.count) > 0 && (
						<Pagination
							count={Math.ceil(sanitizeValue(data?.result?.count) / limit)}
							size="medium"
							page={currentPage}
							onChange={handlePageChange}
						/>
					)}
					<p className="flex items-center space-x-2 font-medium text-slate-700">
						<span>Total result:</span>
						<span className={countStyle}>{sanitizeValue(data?.result?.count)}</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default CkInteriorInquiry;
