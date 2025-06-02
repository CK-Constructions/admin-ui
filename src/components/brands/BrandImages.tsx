import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery, useMutationQuery } from "../../query/hooks/queryHook";
import { TBrandImage, TBrandImageBody } from "../lib/types/response";
import { FaTimes, FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import { Modal, Box, Typography, Paper } from "@mui/material";
import Header from "../common/Header";
import Loading from "../common/Loader";
import { showNotification } from "../utils/utils";
import { uploadMedia } from "../../api";
const BrandImages = () => {
  const params = useParams();
  const { queryFn: getBrandsFunc, queryKeys: brandKey } = queryConfigs.useGetAllBrandImages;
  const { queryFn: addBrandImgFunc, queryKeys: bImgKey } = queryConfigs.useAddBrandImages;
  const { mutate: addBrandImages } = useMutationQuery({
    invalidateKey: bImgKey,
    func: addBrandImgFunc,
    onSuccess: () => {
      showNotification("success", "Images added successfully");
      handleCloseAddImages();
      setImages([]);
      setPreviews([]);
    },
  });
  const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
    func: getBrandsFunc,
    key: brandKey,
    params: {
      id: params.id,
    },
    isEnabled: !!params.id,
  });
  const [scale, setScale] = useState(1);
  const [openAddModal, setOpenAddModal] = useState(false);
  const handleOpenModal = () => {
    setOpenAddModal(true);
  };
  const handleCloseAddImages = () => {
    setOpenAddModal(false);
  };
  const [selectedImage, setSelectedImage] = useState<TBrandImage | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handleScaleUp = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };
  const handleScaleDown = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };
  const handleImageClick = (image: TBrandImage) => {
    setSelectedImage(image);
    setIsFullscreen(true);
  };
  const closeFullscreen = () => {
    setIsFullscreen(false);
    setSelectedImage(null);
  };
  const navigate = useNavigate();
  const [images, setImages] = useState<TBrandImage[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = await Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        })
      );
      setPreviews((prev) => [...prev, ...newPreviews]);
      try {
        const uploadPromises = files.map((file) => uploadMedia(file));
        const responses = await Promise.all(uploadPromises);
        const newImages = responses.map((response) => ({
          image: response.id.toString(),
        }));
        setImages((prev) => [...prev, ...newImages]);
      } catch (error) {
        console.error(error);
        showNotification("error", "Failed to upload some images");
      }
    }
  };
  const handleSubmit = async () => {
    const id = parseInt(params?.id ?? "0", 10);
    const requestBody: TBrandImageBody = {
      id,
      images: images,
    };
    try {
      const response = await addBrandImages(requestBody);
      showNotification("success", "Images added successfully");
      handleCloseAddImages();
      setImages([]);
      setPreviews([]);
    } catch (error) {
      console.error(error);
      showNotification("error", "Failed to add images");
    }
  };
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };
  const tileSize = 200 * scale;
  if (isLoading || isRefetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Loading />
      </Box>
    );
  }
  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">Error loading brand Images. Please try again.</Typography>
      </Box>
    );
  }
  return (
    <div className="p-4">
      <div className="pb-4">
        <Header onBackClick={() => navigate(-1)} onReloadClick={refetch} showButton={true} buttonTitle="Add Images" pageName="Brand Image" buttonFunc={handleOpenModal} />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <button onClick={handleScaleDown} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-2">
          <FaSearchMinus /> Zoom Out
        </button>
        <span className="text-sm">Scale: {Math.round(scale * 100)}%</span>
        <button onClick={handleScaleUp} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-2">
          <FaSearchPlus /> Zoom In
        </button>
      </div>
      <div className="flex flex-wrap gap-4">
        {}
        {data?.result?.list.map((item: TBrandImage) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
            style={{
              width: `${tileSize}px`,
              height: `${tileSize}px`,
            }}
            onClick={() => handleImageClick(item)}
          >
            <img src={`${process.env.REACT_APP_GET_MEDIA}/${item.image}`} alt={`Brand ${item.id}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      {}
      <Modal open={isFullscreen} onClose={closeFullscreen} aria-labelledby="image-modal" aria-describedby="image-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            outline: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="relative w-full h-full">
            <img src={`${process.env.REACT_APP_GET_MEDIA}/${selectedImage?.image}`} alt={`Brand ${selectedImage?.id}`} className="w-full h-full object-contain" />
            <button
              onClick={closeFullscreen}
              className="absolute top-2 right-2 bg-white bg-opacity-30 hover:bg-opacity-50 text-gray-800 rounded-full p-2 transition-all"
              aria-label="Close"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
        </Box>
      </Modal>
      <Modal open={openAddModal} onClose={handleCloseAddImages} aria-labelledby="add-images-modal" aria-describedby="add-images-to-brand">
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
          <h2>Add Images to Brand</h2>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
            {previews.map((preview, index) => (
              <div key={index} style={{ position: "relative" }}>
                <img src={preview} alt={`Preview ${index}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                <button onClick={() => removeImage(index)} style={{ position: "absolute", top: 0, right: 0 }}>
                  ×
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={images.length === 0} style={{ marginTop: "20px" }}>
            Submit Images
          </button>
        </Box>
      </Modal>
    </div>
  );
};
export default BrandImages;
