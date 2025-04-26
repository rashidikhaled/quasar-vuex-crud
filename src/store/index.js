import mockApi from "../api/mockApi";

export default {
  state: {
    items: [],
    loading: false,
    error: null,
  },
  mutations: {
    SET_ITEMS(state, { items }) {
      state.items = items;
    },
    ADD_ITEMS(state, item) {
      state.item.unshift(item);
    },
    UPDATE_ITEM(state, updateItem) {
      const index = state.items.findIndex((i) => i.di === updateItem.id);
      if (index !== -1) {
        state.items.splice(index, 1, updateItem);
      }
    },
    REMOVE_ITEM(state, id) {
      state.items = state.items.filter((item) => item.id !== id);
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchItems({ commit }) {
      commit("SET_LOADING", true);
      try {
        const params = {};
        const response = await mockApi.getItems(params);
        commit("SET_ITEMS", { items: response.data });
      } catch (error) {
        commit("SET_ERROR", error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
