import React, { createContext, useState } from "react";

interface scene {
  id: string;
  time: string;
  description: string;
}

interface VideoContextValue {
  setVideoFile: (file: File | undefined) => void;
  videoFile: File | undefined;
  resetProvider: () => void;
  avalibleScenes: scene[];
  setAvalibleScenes: (scene: scene[]) => void;
  foundScene: scene | undefined;
  setFoundScene: (scene: scene) => void;
  timestamp: string;
  setTimestamp: (time: string) => void;
}

export const VideoContext = createContext<VideoContextValue>(
  {} as VideoContextValue
);

export const VideoContextProvider = ({ children }: React.PropsWithChildren) => {
  const [videoFile, setVideoFile] = useState<File | undefined>();
  const [avalibleScenes, setAvalibleScenes] = useState<scene[]>([]);
  const [foundScene, setFoundScene] = useState<scene>();
  const [timestamp, setTimestamp] = useState<string>("00:00");

  const resetProvider = () => {
    setVideoFile(undefined);
    setAvalibleScenes([]);
  };

  const videoContextValue = {
    videoFile,
    setVideoFile,
    resetProvider,
    avalibleScenes,
    setAvalibleScenes,
    foundScene,
    setFoundScene,
    timestamp,
    setTimestamp,
  };
  return (
    <VideoContext.Provider value={videoContextValue}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContext;
