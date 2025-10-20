import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../slices/authSlice";
import { useLocalStorage } from "./useLocalStorage";
import api from "../api/api";

const useUploadAvatar = () => {
  const user = useSelector((state) => state.auth.user);
  const [storedUser, setStoredUser] = useLocalStorage("user", null);
  const dispatch = useDispatch();

  // function that handles image upload
  const uploadAvatar = async (e,url) => {
    console.log("Uploading avatar...", url);
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Create a local preview URL for immediate UI update
      const previewURL = URL.createObjectURL(file);

      // Update user in Redux with preview URL
      dispatch(setUser({ ...user, avatar: previewURL }));
      setStoredUser({ ...storedUser, avatar: previewURL });
      console.log("Preview URL set:", file);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("avatar", file);

      // Important: Set the correct content type (or remove it to let browser set automatically)
      const response = await api.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update with the real URL from server
      if (response.data?.url) {
        dispatch(setUser({ ...user, avatar: { url: response.data.url } }));
        setStoredUser({ ...storedUser, avatar: { url: response.data.url } });
      }

      return response.data;
    } catch (error) {
      console.error("Avatar upload failed:", error);
      throw error;
    }
  };

  // return the handler
  return { uploadAvatar };
};

export default useUploadAvatar;
