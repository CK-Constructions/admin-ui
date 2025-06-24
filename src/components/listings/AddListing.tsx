import React, { useState } from "react";
import { Autocomplete, Box, Button, Card, CardActions, CardMedia, Grid, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { uploadMedia } from "../../api";
import { showNotification } from "../utils/utils";
import { queryConfigs } from "../../query/queryConfig";
import { useGetQuery } from "../../query/hooks/queryHook";
import { TCategory } from "../lib/types/response";
import { IoCloseSharp } from "react-icons/io5";

interface TAttribute {
  attribute_name: string;
  attribute_value: string;
}
interface TImage {
  image: string;
  is_primary: boolean;
}
interface TListingBody {
  seller_id: number;
  category_id: number;
  title: string;
  description: string;
  price: number;
  delivery_time: number;
  attributes: TAttribute[];
  images: TImage[];
}
const AddListing = () => {
  const { queryFn: UserFunc, queryKey: userKey } = queryConfigs.useGetAllCategories;
  const { data: categoryData } = useGetQuery({
    func: UserFunc,
    key: userKey,
    params: {
      offset: 0,
      limit: 1000,
    },
  });
  const categories = categoryData?.result?.list || [];

  const [formData, setFormData] = useState<TListingBody>({
    seller_id: 0,
    category_id: 0,
    title: "",
    description: "",
    price: 0,
    delivery_time: 0,
    attributes: [],
    images: [],
  });

  const [previewImage, setPreviewImage] = useState<string>("");
  const [attributeName, setAttributeName] = useState<string>("");
  const [attributeValue, setAttributeValue] = useState<string>("");

  //   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files && e.target.files[0]) {
  //       const file = e.target.files[0];
  //       try {
  //         const response = await uploadMedia(file);

  //         const mediaId = response.data.id;
  //         const newImage: TImage = {
  //           image: mediaId.toString(),
  //           is_primary: false,
  //         };
  //         setFormData((prev) => ({
  //           ...prev,
  //           images: [...prev.images, newImage],
  //         }));
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           setPreviewImage(reader.result as string);
  //         };
  //         reader.readAsDataURL(file);
  //       } catch (error) {
  //         console.error(error);
  //         showNotification("error", "Failed to upload image");
  //       }
  //     }
  //   };

  //   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files && e.target.files[0]) {
  //       const file = e.target.files[0];
  //       try {
  //         const response = await uploadMedia(file);
  //         console.log("response", response);
  //         if (response.success) {
  //           const mediaId = response.data.id;
  //           const newImage: TImage = {
  //             image: mediaId.toString(),
  //             is_primary: false,
  //           };
  //           setFormData((prev) => ({
  //             ...prev,
  //             images: [...prev.images, newImage],
  //           }));
  //         }
  //       } catch (error) {
  //         console.error(error);
  //         showNotification("error", "Failed to upload image");
  //       }
  //     }
  //   };

  let uploadTimeout: ReturnType<typeof setTimeout>;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous timeout if it exists
    if (uploadTimeout) clearTimeout(uploadTimeout);

    // Debounce by 500ms
    uploadTimeout = setTimeout(async () => {
      try {
        const response = await uploadMedia(file);
        if (response.success) {
          const newImage: TImage = {
            image: response.id.toString(),
            is_primary: false,
          };
          setFormData((prev) => ({ ...prev, images: [...prev.images, newImage] }));
        } else {
          showNotification("error", "Failed to upload image");
        }
      } catch (error) {
        console.error(error);
        showNotification("error", "Failed to upload image");
      }
    }, 500);
  };

  const handleAttributeAdd = () => {
    if (attributeName && attributeValue) {
      const newAttribute: TAttribute = {
        attribute_name: attributeName,
        attribute_value: attributeValue,
      };
      setFormData((prev) => ({
        ...prev,
        attributes: [...prev.attributes, newAttribute],
      }));
      setAttributeName("");
      setAttributeValue("");
    }
  };
  const handleAttributeRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };
  const handleAttributeChange = (index: number, name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => {
        if (i === index) {
          return { attribute_name: name, attribute_value: value };
        }
        return attr;
      }),
    }));
  };
  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  const handleMakePrimary = (index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.map((image, i) => {
        if (i === index) {
          return { ...image, is_primary: true };
        } else {
          return { ...image, is_primary: false };
        }
      });
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Add Listing
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {/* <TextField
              label="Category ID"
              type="number"
              value={formData.category_id}
              onChange={(e) => setFormData((prev) => ({ ...prev, category_id: parseInt(e.target.value, 10) }))}
              fullWidth
            /> */}
            <Autocomplete
              options={categories}
              getOptionLabel={(option: TCategory) => option?.name}
              onChange={(event, newValue: TCategory | null) => {
                setFormData((prev) => ({
                  ...prev,
                  category_id: newValue?.id ?? 0,
                }));
              }}
              renderInput={(params) => <TextField {...params} label="Select Category" variant="outlined" placeholder="Search categories..." />}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name} {option.is_active === 0 && "(Inactive)"}
                </li>
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={categories.find((cat: TCategory) => cat?.id === formData?.category_id) || null}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Title" type="text" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              type="text"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Price" type="number" value={formData.price} onChange={(e) => setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) }))} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Delivery Time"
              type="number"
              value={formData.delivery_time}
              onChange={(e) => setFormData((prev) => ({ ...prev, delivery_time: parseInt(e.target.value, 10) }))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Attributes
            </Typography>
            <ul className="list-none">
              {formData.attributes.map((attr, index) => (
                <li key={index} className="flex items-center mb-2">
                  <TextField
                    label="Attribute Name"
                    type="text"
                    value={attr.attribute_name}
                    onChange={(e) => handleAttributeChange(index, e.target.value, attr.attribute_value)}
                    sx={{ marginRight: 2 }}
                  />
                  <TextField
                    label="Attribute Value"
                    type="text"
                    value={attr.attribute_value}
                    onChange={(e) => handleAttributeChange(index, attr.attribute_name, e.target.value)}
                    sx={{ marginRight: 2 }}
                  />
                  <Button variant="contained" color="error" onClick={() => handleAttributeRemove(index)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex items-center mb-2">
              <TextField label="Attribute Name" type="text" value={attributeName} onChange={(e) => setAttributeName(e.target.value)} sx={{ marginRight: 2 }} />
              <TextField label="Attribute Value" type="text" value={attributeValue} onChange={(e) => setAttributeValue(e.target.value)} sx={{ marginRight: 2 }} />
              <Button variant="contained" color="primary" onClick={handleAttributeAdd}>
                Add Attribute
              </Button>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Images
            </Typography>
            <input type="file" onChange={handleImageChange} className="block mb-2" />
            {previewImage && <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover mb-2" />}
            <div className="grid grid-cols-4 gap-2">
              {formData.images.map((image, index) => {
                const imgUrl = `${process.env.REACT_APP_GET_MEDIA}/${image.image}`;
                return (
                  <div key={index} className="relative">
                    <img
                      src={imgUrl}
                      //   alt={`Image ${index}`}
                      alt=""
                      className="w-full h-32 object-contain border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "path/to/placeholder.jpg";
                        target.alt = "Failed to load image";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-1 text-xs">{image.image}</div>
                  </div>
                );
              })}
            </div>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Create Listing
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default AddListing;
