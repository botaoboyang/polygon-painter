import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    polygons: [],
    showGrid: false
  },
  mutations: {
    update_polygons (state, v) {
      state.polygons = v
    },
    update_showGrid (state, v) {
      state.showGrid = v
    }
  }
})
window.store = store
export default store
