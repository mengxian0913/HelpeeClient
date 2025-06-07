import { UserState, UserStateEnum } from "@/utils/type";
import axios from "axios";
import { API_BASE_URL } from "./config";



export const apiCheckUserState = async (): Promise<UserState> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No authentication token found");
      return UserStateEnum.NONE;
    }

    const { data } = await axios.get<any>(`${API_BASE_URL}/parse_jwt/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return data["user_type"];

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


export const apiRegister = async (account: string, password: string, email: string, username: string, userType: string): Promise<void> => {
  try {
    const params = new URLSearchParams();
    params.append("account", account);
    params.append("password", password);
    params.append("username", username);
    params.append("user_type", userType);
    params.append("email", email);

    const response = await axios.post(
      `${API_BASE_URL}/adduser/`,
      params,
      {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      }
    );

    if (response.status === 201) {
      console.log("Registration successful");
    } else {
      console.error("Registration failed:", response.data);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API request failed:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error during registration:", error);
    }
  }
}


// normaluser1  TestPass123
// disadv
export const apiLogin = async (account: string, password: string): Promise<string> => {
  try {
    const params = new URLSearchParams();
    params.append("account", account);
    params.append("password", password);

    const response = await axios.post(
      `${API_BASE_URL}/login/`,
      params,
      {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      }
    );

    if (response.status === 200) {
      const token = response.data.access;
      localStorage.setItem("token", token);
      return token;
    } else {
      console.error("Login failed:", response.data);
      throw new Error("Login failed");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API request failed:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error during login:", error);
    }
    throw error;
  }
};