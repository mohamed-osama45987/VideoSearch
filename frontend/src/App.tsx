import { VideoContextProvider } from "./contexts/VideoContext";
import VideoUploader from "./components/VideoUploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <VideoContextProvider>
      <div className="h-screen w-screen bg-slate-800 flex justify-center items-center">
        <VideoUploader />
        <ToastContainer
          position="bottom-center"
          limit={1}
          draggable={false}
          autoClose={3000}
        />
      </div>
    </VideoContextProvider>
  );
};

export default App;
