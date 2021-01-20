import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    polygons: [],
    history: [],
    undoHistory: [],

    showGrid: false,
    showStats: true
  },

  getters: {
    canUndo: state => state.history.length > 0,
    canRedo: state => state.undoHistory.length > 0
  },

  mutations: {

    updatePolygons (state, v) {
      state.history.push(state.polygons)
      state.undoHistory = []
      state.polygons = v
    },

    undo (state) {
      state.undoHistory.push(state.polygons)
      state.polygons = state.history.pop()
    },

    redo (state) {
      state.history.push(state.polygons)
      state.polygons = state.undoHistory.pop()
    },

    toggleShowGrid (state) {
      state.showGrid = !state.showGrid
    }

  }
})
window.store = store
export default store
