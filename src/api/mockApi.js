import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000,
});

export default {
  async getItems(params = {}) {
    try {
      const response = await api.get("/todos", { params });
      return response;
    } catch (error) {
      console.log("Error Fetching Items", error);
      throw error;
    }
  },
  async addItem(item) {
    try {
      const response = await api.post("/todos", item);
      return response;
    } catch (error) {
      console.error("Error adding item:", error);
      throw error;
    }
  },
  async updateItem(id, updates) {
    try {
      const response = await api.patch(`/todos/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  },
  async deleteItem(id) {
    try {
      await api.delete(`/todos/${id}`);
      return id;
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  },
  async exportItems(params = {}) {
    try {
      const response = await api.get(`/todos`, { params });
      return response.data;
    } catch (error) {
      console.error("Error exporting items:", error);
      throw error;
    }
  },
};
