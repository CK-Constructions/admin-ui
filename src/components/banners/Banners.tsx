import { Box, Button, Checkbox, Chip, Modal, Paper, TextField, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { TSubCatImageBody } from "../lib/types/response";
import { uploadMedia } from "../../api";
import { showNotification } from "../utils/utils";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery, useMutationQuery } from "../../query/hooks/queryHook";
import Header from "../common/Header";
import { useNavigate } from "react-router";
import { FaBan, FaCheck, FaSearchMinus, FaSearchPlus, FaTimes, FaTrash } from "react-icons/fa";
import { TBanner, TBannerBody } from "../lib/types/common";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { BsUniversalAccessCircle } from "react-icons/bs";
import { BannerStatusModal } from "../buyers/ActiveBannerModal";

const Banners = () => {
  const LIMIT = 10;
  const tileSize = 200;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<TBanner | null>(null);
  const [isBannerActive, setIsBannerActive] = useState(false);

  const handleOpenDeactivateModal = (banner: TBanner) => {
    setSelectedBanner(banner);
    setIsBannerActive(true); // true means the banner is currently active
    setIsModalOpen(true);
  };

  const handleOpenActivateModal = (banner: TBanner) => {
    setSelectedBanner(banner);
    setIsBannerActive(false); // false means the banner is currently inactive
    setIsModalOpen(true);
  };

  const [selectMode, setSelectMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const { queryFn: getAllBannersFunc, queryKeys: bannerKey } = queryConfigs.useGetAllBanners;

  const { queryFn: enableBanner } = queryConfigs.useEnableBanner;
  const { queryFn: disableBanner } = queryConfigs.useDisableBanner;

  const { queryFn: addBannerFunc } = queryConfigs.useAddBanner;
  const { data, refetch, isLoading, isRefetching, isError } = useGetQuery({
    func: getAllBannersFunc,
    key: bannerKey,
    params: {
      offset: (currentPage - 1) * LIMIT,
      limit: LIMIT,
    },
  });
  const { mutate: addBanner } = useMutationQuery({
    invalidateKey: bannerKey,
    func: addBannerFunc,
    onSuccess: () => {
      showNotification("success", "Banner added successfully");
      handleCloseAddImages();
      setImages([]);
      setPreviews([]);
    },
  });
  const { mutate: enable } = useMutationQuery({
    invalidateKey: bannerKey,
    func: enableBanner,
    onSuccess: () => {
      showNotification("success", "Banner enabled successfully");
      handleCloseAddImages();
      setImages([]);
      setPreviews([]);
    },
  });
  const { mutate: disable } = useMutationQuery({
    invalidateKey: bannerKey,
    func: disableBanner,
    onSuccess: () => {
      showNotification("success", "Banner added successfully");
      handleCloseAddImages();
      setImages([]);
      setPreviews([]);
    },
  });
  const [images, setImages] = useState<Partial<TBanner>[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [bannerData, setBannerData] = useState<TBannerBody>({
    image: undefined,
    description: "",
    path: "",
    title: "",
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Only take the first file if multiple are selected
      const file = e.target.files[0];

      // Create preview
      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      setPreviews([preview]); // Only keep one preview

      try {
        // Upload the image
        const response = await uploadMedia(file);
        setBannerData((prev) => ({
          ...prev,
          image: response.id.toString(),
        }));
      } catch (error) {
        console.error(error);
        showNotification("error", "Failed to upload image");
      }
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBannerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await addBanner(bannerData);
      showNotification("success", "Banner added successfully");
      handleCloseAddImages();
      setBannerData({
        image: undefined,
        description: "",
        path: "",
        title: "",
      });
      setPreviews([]);
    } catch (error) {
      console.error(error);
      showNotification("error", "Failed to add banner");
    }
  };
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedImages([]);
    }
  };

  const [openAddModal, setOpenAddModal] = useState(false);
  const handleOpenModal = () => {
    setOpenAddModal(true);
  };
  const handleCloseAddImages = () => {
    setOpenAddModal(false);
  };
  const [scale, setScale] = useState(1);

  const [selectedImage, setSelectedImage] = useState<TBanner | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handleScaleUp = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };
  const handleScaleDown = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };
  const toggleImageSelection = (imageId: number) => {
    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]));
  };

  const handleImageClick = (image: TBanner) => {
    if (selectMode) {
      toggleImageSelection(image?.id || 0);
    } else {
      setSelectedImage(image);
      setIsFullscreen(true);
    }
  };
  const closeFullscreen = () => {
    setIsFullscreen(false);
    setSelectedImage(null);
  };
  const [selectedUser, setSelectedUser] = useState<TBanner | null>(null);
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const handleOpenBanDialog = (image: TBanner) => {
    setSelectedUser(image);
    setOpenBanDialog(true);
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="p-4">
        <div className="pb-4">
          <Header onBackClick={() => navigate(-1)} onReloadClick={refetch} showButton={true} buttonTitle="Add Images" pageName="Sub Category Image" buttonFunc={handleOpenModal} />
        </div>
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button onClick={handleScaleDown} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-2">
              <FaSearchMinus /> Zoom Out
            </button>
            <span className="text-sm">Scale: {Math.round(scale * 100)}%</span>
            <button onClick={handleScaleUp} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-2">
              <FaSearchPlus /> Zoom In
            </button>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* {selectMode && (
            <button
              onClick={handleDeleteSelected}
              disabled={selectedImages.length === 0}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2 disabled:bg-gray-400"
            >
              <FaTrash /> Delete Selected ({selectedImages.length})
            </button>
          )} */}
            <button
              onClick={toggleSelectMode}
              className={`px-3 py-1 rounded flex items-center gap-2 ${selectMode ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              {selectMode ? <FaCheck /> : <FaTrash />}
              {selectMode ? "Cancel Selection" : "Select Images"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {data?.result?.list.map((item: TBanner) => (
            <div
              key={item.id}
              className="relative rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
              style={{
                width: "390px",
                height: "430px",
                padding: "8px",
              }}
            >
              {selectMode && (
                <Checkbox
                  checked={selectedImages.includes(item?.id || 0)}
                  onChange={() => toggleImageSelection(item?.id || 0)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    top: 5,
                    left: 5,
                    zIndex: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                  }}
                />
              )}
              <div onClick={() => handleImageClick(item)} className="flex-1 overflow-hidden mb-2">
                <img
                  src={`${process.env.REACT_APP_BASE_URL}/${item.image}`}
                  alt={`Brand ${item.id}`}
                  className="w-full h-full object-contain"
                  style={{
                    opacity: selectMode && selectedImages.includes(item.id || 0) ? 0.7 : 1,
                  }}
                />
              </div>
              <div className="flex items-center pl-4">
                <span>
                  <Chip
                    label={item.is_active === 0 ? "Active" : "Disabled"}
                    color={item.is_active === 0 ? "success" : "error"}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderWidth: 1.5,
                      "& .MuiChip-label": {
                        px: 0.75,
                      },
                    }}
                  />
                </span>
              </div>
              <div className="p-2 text-sm space-y-1">
                <div className="flex items-center">
                  <span className="font-semibold mr-1">Title:</span>
                  <span className="truncate">{item.title}</span>
                </div>

                <div className="flex items-center">
                  <span>Path:</span>
                  <span className="">{item.path}</span>
                </div>
                <div className="flex items-center">
                  <span>Description:</span>
                  <span className="truncate">{item.description}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-1">Created:</span>
                  <span>{new Date(item.created_on).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="border-1 border-gray-600 px-5"></div>
              <div>
                {item.is_active === 0 && (
                  <Tooltip title="Disable Banner">
                    <button onClick={() => handleOpenActivateModal(item)} className="red-action-button">
                      <FaBan size={14} />
                    </button>
                  </Tooltip>
                )}
                {item.is_active === 1 && (
                  <Tooltip title="Enable Banner">
                    <button onClick={() => handleOpenDeactivateModal(item)} className="green-action-button">
                      <BsUniversalAccessCircle size={14} />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
          ))}
        </div>
        <Modal open={isFullscreen} onClose={closeFullscreen} aria-labelledby="image-modal" aria-describedby="image-modal-description">
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 900,
              height: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              outline: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              aspectRatio: "16 / 9",
            }}
          >
            <div className="relative w-full h-full">
              <img src={`${process.env.REACT_APP_BASE_URL}/${selectedImage?.image}`} alt={`Brand ${selectedImage?.id}`} className="w-full h-full object-contain" />
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
              minHeight: 320,
              maxHeight: "80vh",
              outline: "none",
              overflowY: "auto",
            }}
            component={Paper}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Add Banner
            </Typography>

            {/* Drag and drop area */}
            <Box
              sx={{
                border: "2px dashed",
                borderColor: "grey.400",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                mb: 3,
                cursor: "pointer",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "action.hover",
                },
              }}
              onClick={() => document.getElementById("banner-upload")?.click()}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleImageChange({
                    target: { files: e.dataTransfer.files },
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <input id="banner-upload" type="file" onChange={handleImageChange} accept="image/*" style={{ display: "none" }} />
              {previews.length > 0 ? (
                <img
                  src={previews[0]}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-center">
                      <MdOutlineAddToPhotos
                        style={{
                          fontSize: 48,
                          color: "gray",
                          marginBottom: 1,
                        }}
                        className="text-center"
                      />
                    </div>
                    <Typography variant="body1" color="text.secondary">
                      Click to browse or drag & drop your image here
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      (Only one image allowed)
                    </Typography>
                  </div>
                </>
              )}
            </Box>

            {/* Form fields */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField fullWidth label="Title" name="title" value={bannerData.title} onChange={handleInputChange} variant="outlined" />

              <TextField fullWidth label="Description" name="description" value={bannerData.description} onChange={handleInputChange} variant="outlined" multiline rows={3} />

              <TextField fullWidth label="Path (URL)" name="path" value={bannerData.path} onChange={handleInputChange} variant="outlined" />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button variant="contained" onClick={handleSubmit} disabled={!bannerData.image} sx={{ px: 4 }}>
                Submit Banner
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
      {selectedBanner && <BannerStatusModal open={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedBanner} isActive={isBannerActive} />}
    </>
  );
};

export default Banners;
