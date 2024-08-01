import { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import VideoContext from "../contexts/VideoContext";
import SearchBar from "./SearchBar";

const VideoPlayer = () => {
  const { videoFile, timestamp } = useContext(VideoContext);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);

  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(url);

      // Clean up the URL object when the component unmounts
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  const parseTimestamp = (timeStr: string): number => {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    return (minutes || 0) * 60 + (seconds || 0);
  };

  useEffect(() => {
    if (playerRef.current && videoUrl) {
      const seconds = parseTimestamp(timestamp);
      playerRef.current.seekTo(seconds);
    }
  }, [videoUrl, timestamp]);

  return (
    <div className="flex flex-col items-center ">
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        controls
        width="80%"
        height="auto"
        playing={false} // Ensure the video does not autoplay
      />

      <SearchBar />
    </div>
  );
};

export default VideoPlayer;
