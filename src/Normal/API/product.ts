import axios from "axios";
import { API_BASE_URL } from "../../API/config";

export const apiGetProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await axios.get<Product[]>(`${API_BASE_URL}/product/`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API request failed:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error during fetching products:", error);
    }
    return [];
  } 
}

export const apiAddProduct = async (itemID: string, amount: number): Promise<string> => {
  try {
    const params = new URLSearchParams();
    params.append("itemID", itemID);
    params.append("amount", amount.toString());

    const response = await axios.post(
      `${API_BASE_URL}/purchase/`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 201) {
      return "Product added to cart successfully";
    } else {
      console.error("Failed to add product to cart:", response.data);
      throw new Error("Failed to add product to cart");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API request failed:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error during adding product:", error);
    }
    throw error;
  }
}