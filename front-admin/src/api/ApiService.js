import AxiosInstance from "./AxiosInstance";

class ApiService {
  // Users
  async getRestaurantUser() {
    const { data } = await AxiosInstance.get(`/restaurants`);
    return data;
  }
  async getLoggedUser() {
    const { data } = await AxiosInstance.get(`/users/@me`);
    console.log(data);
    return data;
  }
  async createRestaurantUser(user) {
    const { data } = await AxiosInstance.post(`/restaurants`, {
      data: user
    });
    return data;
  }
  async updateRestaurantUser(_id, user) {
    const { data } = await AxiosInstance.patch(`/restaurants/${_id}`, {
      data: user
    });
    return data;
  }
  async deleteRestaurantUser(_id) {
    const { data } = await AxiosInstance.delete(`/restaurants/${_id}`);
    return data;
  }


  // Recipes
  async getRestaurantPlates() {
    const { data } = await AxiosInstance.get(`/recipes`);
    return data;
  }
  async getPlate(_id) {
    const { data } = await AxiosInstance.get(`/recipes/${_id}`);
    return data;
  }
  async createPlate(plate) {
    const { data } = await AxiosInstance.post(`/recipes`, {
      data: plate
    });
    return data;
  }
  async updatePlate(_id, plate) {
    const { data } = await AxiosInstance.patch(`/recipes/${_id}`, {
      data: plate
    });
    return data;
  }

  
  // Orders
  async getRestaurantOrders() {
    const { data } = await AxiosInstance.get(`/orders`);
    return data;
  }
  async cancelOrder(_id) {
    const { data } = await AxiosInstance.patch(`/orders/${_id}`);
    return data;
  }
}

export default new ApiService();
