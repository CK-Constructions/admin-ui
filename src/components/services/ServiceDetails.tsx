import { useState } from "react";
import { ChevronLeft, ChevronRight, Phone, Tag, Clock, Calendar, User, Info, Truck, DollarSign } from "lucide-react";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { useNavigate, useParams } from "react-router";
import { TRentalImage, TRentalRate, TRentalSpecification } from "../lib/types/response";

export default function ServiceDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const { queryFn: rentalFunc, queryKeys: rentalKey } = queryConfigs.useGetServiceDetails;
  const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
    func: rentalFunc,
    key: rentalKey,
    params: {
      id: id,
    },
    isEnabled: !!id,
  });
  const rentalData = data?.result;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === rentalData?.images_list?.length - 1 ? 0 : prevIndex + 1));
  };
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? rentalData?.images_list?.length - 1 : prevIndex - 1));
  };

  const handleNavBack = () => {
    navigate(-1);
  };
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading rental data</div>;
  if (!rentalData) return <div>No rental data found</div>;
  return (
    <div className="container py-8 mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={handleNavBack} className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Services
        </button>
      </div>
      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="relative aspect-video bg-muted">
              {rentalData.images_list?.length > 0 && (
                <>
                  <img
                    src={`${process.env.REACT_APP_GET_MEDIA}/${rentalData.images_list[currentImageIndex].image}`}
                    alt={`${rentalData.name}-${currentImageIndex + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <button className="p-2 rounded-full bg-white opacity-80 hover:opacity-100 shadow" onClick={prevImage}>
                      <ChevronLeft className="w-6 h-6" />
                      <span className="sr-only">Previous image</span>
                    </button>
                    <button className="p-2 rounded-full bg-white opacity-80 hover:opacity-100 shadow" onClick={nextImage}>
                      <ChevronRight className="w-6 h-6" />
                      <span className="sr-only">Next image</span>
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {rentalData.images_list.map((_: any, index: number) => (
                      <button
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full ${index === currentImageIndex ? "bg-primary" : "bg-primary/30"}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <span className="sr-only">Go to image {index + 1}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {rentalData.images_list?.length > 1 && (
              <div className="flex gap-2 p-2 overflow-x-auto">
                {rentalData.images_list.map((image: TRentalImage, index: number) => (
                  <button
                    key={index}
                    className={`relative w-20 h-20 overflow-hidden rounded-md flex-shrink-0 ${index === currentImageIndex ? "ring-2 ring-primary" : "opacity-70"}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={`${process.env.REACT_APP_GET_MEDIA}/${image.image}`} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{rentalData.name}</h2>
                  <div className="flex items-center mt-2 text-muted-foreground">
                    <Tag className="w-4 h-4 mr-1" />
                    {rentalData.category_name}
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${rentalData.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                  {rentalData.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Description</h3>
                <p className="text-muted-foreground">{rentalData.description || "No description provided."}</p>
              </div>
              <hr className="border-t border-gray-200" />

              <div>
                <h3 className="mb-4 text-lg font-semibold">Specifications</h3>
                {rentalData.specifications && rentalData.specifications.length > 0 ? (
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specification</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {rentalData.specifications.map((spec: TRentalSpecification, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{spec.label}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specifications available.</p>
                )}
              </div>
              <hr className="border-t border-gray-200" />

              <div>
                <h3 className="mb-4 text-lg font-semibold">Rental Rates</h3>
                {rentalData.rates_list && rentalData.rates_list.length > 0 ? (
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {rentalData.rates_list.map((rate: TRentalRate, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{rate.period}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-semibold">
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {rate.rate.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No rates available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Seller Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-muted-foreground" />
                <span>{rentalData.seller_fullname || rentalData.seller_name}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-muted-foreground" />
                <span>{rentalData.contact_phone}</span>
              </div>
              <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Contact Seller</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Delivery Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Delivery Time</p>
                  <p className="text-muted-foreground">{rentalData.delivery_time} days</p>
                </div>
              </div>
              <div className="flex items-start">
                <Truck className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Delivery Fee</p>
                  <p className="text-muted-foreground">{rentalData.delivery_fee ? `$${rentalData.delivery_fee}` : "Contact seller for details"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Additional Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Rental ID</p>
                  <p className="text-muted-foreground">#{rentalData.id}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Listed On</p>
                  <p className="text-muted-foreground">{rentalData.created_on ? new Date(rentalData.created_on).toLocaleDateString() : "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            {rentalData.is_banned === 0 ? (
              <button className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Ban</button>
            ) : (
              <button className="flex-1 px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50">UnBan</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
