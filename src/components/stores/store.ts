import { createStore } from 'vuex';

const audioContext = new AudioContext();
const store = createStore({
  state: {
    audioContext: audioContext
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
});

export default store;