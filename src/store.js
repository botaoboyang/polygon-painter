import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    polygons: [],
    history: [],
    undo_history: [],

    showGrid: false,
    showStats: true
  },

  getters: {
    canUndo: state => state.history.length > 0,
    canRedo: state => state.undo_history.length > 0
  },

  mutations: {

    update_polygons (state, v) {
      state.history.push(state.polygons)
      state.undo_history = []
      state.polygons = v
    },

    undo (state) {
      state.undo_history.push(state.polygons)
      state.polygons = state.history.pop()
    },

    redo (state) {
      state.history.push(state.polygons)
      state.polygons = state.undo_history.pop()
    },

    toggle_showGrid (state) {
      state.showGrid = !state.showGrid
    }

  }
})
window.store = store
export default store
