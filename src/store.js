import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    polygons: []
  },
  mutations: {
    update_polygons (state, v) {
      state.polygons = v
    }
  }
})
window.store = store
export default store
