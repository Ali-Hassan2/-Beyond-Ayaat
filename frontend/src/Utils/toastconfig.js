import { toast } from "react-toastify";


const defaultOptions = {
  position: "top-right",
  autoClose: 3000, // 1 second
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

 const showToast = (message, type = "info") => {
  const customStyle = {
    backgroundColor: "#158b0aff",
    color: "white",
    fontWeight: "bold",
    fontSize: "20px",
    borderRadius: "15px",
  };

  switch (type) {
    case "success":
      toast.success(message, { ...defaultOptions, style: customStyle });
      break;
    case "error":
      toast.error(message, { ...defaultOptions, style: customStyle });
      break;
    case "warning":
      toast.warning(message, { ...defaultOptions, style: customStyle });
      break;
    default:
      toast.info(message, { ...defaultOptions, style: customStyle });
  }
};

export { showToast };