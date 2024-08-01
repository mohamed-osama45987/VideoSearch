import axios from "axios";
import React, { useContext, useState } from "react";
import VideoContext from "../contexts/VideoContext";
import { toast } from "react-toastify";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { setTimestamp, avalibleScenes } = useContext(VideoContext);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      setLoading(true);
      const { data: responseData } = await axios.post(
        `${import.meta.env.VITE_API_DEFAULT_ROUTE}/api/video/search`,
        {
          instruction: query,
          avalibleScenes,
        }
      );
      const { scene } = responseData;
      setTimestamp(scene.time);
    } catch (error) {
      console.log("search error", error);
      toast.error("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <label
      className="mt-7 relative bg-white w-3/5 flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-2xl focus-within:border-gray-300"
      htmlFor="search-bar"
    >
      <input
        id="search-bar"
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Ask me something..."
        className="px-6 py-2 w-full rounded-md flex-1 outline-none bg-white"
      />
      <button
        type="submit"
        onClick={handleSearch}
        disabled={loading}
        className="w-full md:w-auto px-6 py-3 bg-black border-black text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all disabled:opacity-70"
      >
        <div className="relative">
          <div
            className={`flex items-center justify-center h-3 w-3 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ${
              loading ? "opacity-100" : "opacity-0"
            }`}
          >
            <svg
              className={`w-full h-full ${
                loading ? "animate-spin" : "opacity-0"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>

          <div
            className={`flex items-center transition-all ${
              loading ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="text-sm font-semibold whitespace-nowrap truncate mx-auto">
              Submit
            </span>
          </div>
        </div>
      </button>
    </label>
  );
};

export default SearchBar;
