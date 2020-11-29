import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    currentId: 1,
    polygons: []
  },

  mutations: {

    addPolygon(state, polygon) {
      polygon.id = state.currentId ++
      this.commit("updatePolygon", polygon)
      state.polygons.push(polygon)
      return polygon
    },

    updatePolygon(state, polygon) {
      try {
        polygon.data = JSON.parse(polygon.json)
        polygon.isValid = true
      } catch {
        polygon.isValid = false
      }
    },

    popPolygon(state, id) {
      state.polygons = state.polygons.filter(p => p.id !== id)
    },

    clearPolygons(state) {
      state.polygons = []
    },

  }
})

export default store
