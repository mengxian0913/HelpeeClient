import { API_BASE_URL } from "@/API/config";
import axios from "axios";

export const apiGetCoinHistory = async (): Promise<any[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    const response = await axios.get(`${API_BASE_URL}/coin/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('====================================');
    console.log('====================================');
    console.log("Coin history response:", response.data);
    console.log('====================================');
    console.log('====================================');    

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch coin history:", response.data);
      return [];
    }
  } catch ( err ) {
    if (axios.isAxiosError(err)) {
      console.error("API request failed:", err.response?.data || err.message);
    } else {
      console.error("Unexpected error during fetching coin history:", err);
    }
    return [];
  }
}



export const apiPurchaseCoin = async (coin: number) => {
  try {
    const params = new URLSearchParams();
    params.append("amount", coin.toString());

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    console.log('====================================');
    console.log(coin.toString());
    console.log('====================================');

    const response = await axios.post(
      `${API_BASE_URL}/create_coin/`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      return "Coin purchase successful";
    } else {
      console.error("Failed to purchase coin:", response.data);
      throw new Error("Failed to purchase coin");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API request failed:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error during coin purchase:", error);
    }
    throw error;
  }
}