import { useState, useCallback } from "react";
import axios from "axios";
import { getCloudinaryPublicId } from "~/utils/getCloudinaryPublicId";
import axiosInstance from "~/utils/axioxInstance";

const useFile = () => {
  const [fileUploading, setFileUploading] = useState(false);
  const [fileDeleting, setFileDeleting] = useState(false);
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  // Upload a single file
  const uploadFile = useCallback(async (file) => {
    setFileUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(`/api/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFileUploading(false);
      return response.data.file;
    } catch (error) {
      setFileUploading(false);
      throw new Error(error);
    }
  }, []);

  //  UPLOAD SINGLE PUBLIC FILE
  const uploadPublicFile = useCallback(async (file) => {
    setFileUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`/api/media/public/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFileUploading(false);
      return response.data.data;
    } catch (error) {
      setFileUploading(false);
      throw new Error(error);
    }
  }, []);

  // Delete a file by ID
  const deleteFile = useCallback(async (fileUrl) => {
    setFileDeleting(true);
    const publicId = getCloudinaryPublicId(fileUrl);
    try {
      const response = await axiosInstance.delete(`/api/file/${publicId}`);
      setFileDeleting(false);
      return response.data;
    } catch (error) {
      setFileDeleting(false);
      throw error;
    }
  }, []);

  //  DELETE PUBLIC FILE
  const deletePublicFile = useCallback(async (fileUrl) => {
    setFileDeleting(true);
    const publicId = getCloudinaryPublicId(fileUrl);
    try {
      const response = await axiosInstance.delete(
        `/api/media/public/upload/${publicId}`
      );
      setFileDeleting(false);
      return response.data;
    } catch (error) {
      setFileDeleting(false);
      throw error;
    }
  }, []);

  return {
    fileUploading,
    fileDeleting,
    uploadFile,
    uploadPublicFile,
    deletePublicFile,
    deleteFile,
  };
};

export default useFile;
