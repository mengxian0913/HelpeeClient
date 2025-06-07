import { UserState, UserStateEnum } from "@/utils/type";
import axios from "axios";


export const apiCheckUserState = async (): Promise<UserState> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No authentication token found");
      return UserStateEnum.NONE;
    }

    const { data } = await axios.get<UserState>("/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.warn("Authentication token is invid or expired");
        localStorage.removeItem("token"); // 清除無效 token
      } else if (error.response?.status === 403) {
        console.warn("Access forbidden - insufficient permissions");
      } else if (error.code === 'ECONNABORTED') {
        console.error("Request timeout - please check your connection");
      } else {
        console.error("API request failed:", error.response?.data || error.message);
      }
    } else {
      console.error("Unexpected error checking user state:", error);
    }
    
    return UserStateEnum.NONE;
  }
};