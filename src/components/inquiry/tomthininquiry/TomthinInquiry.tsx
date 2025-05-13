import React, { useState } from "react";
import { queryConfigs } from "../../../query/queryConfig";
import { useGetQuery } from "../../../query/hooks/queryHook";
import { TInquiry } from "../../lib/types/response";
import { sanitizeValue } from "../../utils/utils";
import { Box, CircularProgress, Pagination, Typography } from "@mui/material";
import { countStyle } from "../../vendors/Vendors";
import { useNavigate } from "react-router";
import Header from "../../common/Header";
import { FaPhone } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
interface InquiryCardsProps {
  limit: number;
  currentPage: number;
}

const TomthinInquiry = () => {
  const navigate = useNavigate();
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
  };
  const { queryFn, queryKey } = queryConfigs.useGetTomthinInquiry;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // or format as you prefer
  };

  if (isLoading || isFetching || isRefetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Error states
  if (isLoadingError || isRefetchError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">Error loading buyers data. Please try again.</Typography>
      </Box>
    );
  }

  // No data state
  if (!data || !data.result || !data.result.list || data.result.list.length === 0) {
    return (
      <Box display="flex" flexDirection="column" height="100%">
        <div className="pb-4">
          <Header onBackClick={() => navigate(-1)} pageName="Tomthin Inquiries" />
        </div>
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
          <Typography>No Inquiry found</Typography>
        </Box>
      </Box>
    );
  }
  return (
    <div className="space-y-4">
      <div className="pb-4">
        <Header onBackClick={() => navigate(-1)} pageName="Tomthin Inquiries" />
      </div>
      <div className="text-sm text-gray-500">
        Showing {data.result.list.length} of {data.result.count} inquiries
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.result.list.map((inquiry: TInquiry) => (
          <div
            key={inquiry.id}
            className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-800 truncate">{inquiry.full_name}</h3>
              <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{formatDate(inquiry.created_on)}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <MdOutlineEmail className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Email</p>
                  <a href={`mailto:${inquiry.email}`} className="text-sm text-blue-600 hover:underline truncate block">
                    {inquiry.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <FaPhone className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Phone</p>
                  <a href={`tel:${inquiry.mobile}`} className="text-sm text-gray-700 hover:text-blue-600">
                    {inquiry.mobile}
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1">Message</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{inquiry.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center mt-5">
        <div className="flex items-center justify-end space-x-3">
          {sanitizeValue(data?.result?.count) > 0 && (
            <Pagination count={Math.ceil(sanitizeValue(data?.result?.count) / limit)} size="medium" page={currentPage} onChange={handlePageChange} />
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

export default TomthinInquiry;
