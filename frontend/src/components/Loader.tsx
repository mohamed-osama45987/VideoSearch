import { Oval } from "react-loader-spinner";

const Loader = ({ label = "Processing..." }: { label?: string }) => {
  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <Oval visible={true} ariaLabel="oval-loading" color="#ffffff" />
      <p className="text-white">{label}</p>
    </div>
  );
};

export default Loader;
