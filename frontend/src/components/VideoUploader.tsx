import { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import VideoContext from "../contexts/VideoContext";
import VideoPlayer from "./VideoPlayer";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "./Loader";

const VideoUploader = () => {
  const { videoFile, setVideoFile, resetProvider, setAvalibleScenes } =
    useContext(VideoContext);
  const [isProcessing, setIsProcessing] = useState(false);

  const uploadVideo = useCallback(
    async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        // send the video to the api
        const { data: responseData } = await axios.post(
          `${import.meta.env.VITE_API_DEFAULT_ROUTE}/api/video/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setAvalibleScenes(responseData.scenes);
        toast.success("Processed successfully!");
      } catch (error) {
        console.log("error uplading", error);
        toast.error(
          "An error occurred while Processing the video. Please try again later."
        );
        resetProvider();
        setIsProcessing(false);
      }
    },
    [resetProvider, setAvalibleScenes]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsProcessing(true);
      const file = acceptedFiles[0];

      if (!file) {
        setIsProcessing(false);
        return;
      }
      // Create a URL object for the file to check its duration
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = videoUrl;

      video.addEventListener("loadedmetadata", async () => {
        if (video.duration > 180) {
          toast.error("The video is longer than 3 minutes.");
        } else {
          await uploadVideo(file);
          setVideoFile(file);
        }
        setIsProcessing(false);
        URL.revokeObjectURL(videoUrl);
      });
    },
    [setVideoFile, uploadVideo]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
    },
    maxFiles: 1,
    maxSize: 104857600, // limit to 100 MB,
    multiple: false,
    onDropRejected: () => {
      toast.error("Please upload a valid video file");
    },
  });

  if (isProcessing) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return videoFile ? (
    <VideoPlayer />
  ) : (
    <div
      {...getRootProps()}
      className="min-w-72 border-4 border-dashed rounded-sm min-h-72  flex justify-center items-center text-white p-10 mb-20"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag 'n' drop a file here, or click to select file</p>
      )}
    </div>
  );
};

export default VideoUploader;
