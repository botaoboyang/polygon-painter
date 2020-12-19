<template>
  <div class="left-bar">
    <div class="input-container">
      <input v-model="newPolygonJSON"/>
      <button :disabled="error" @click="addPolygon">添加</button>
      <button @click="addRandomPolygon">随机</button>
      <button @click="clearPolygons">清除</button>
      <div v-show="newPolygonJSON.length>0" class="error-tip">
        {{ error }}
      </div>
    </div>
    <div class="item-container">
      <div
        class="item"
        v-for="poly in polygons"
        :key="poly.id"
        :style="{backgroundColor: poly.isVisible ? poly.color : 'white'}"
        @mouseenter="focus(poly)"
        >
        <input v-model="poly.name" />
        <button @click="handleDelete(poly)">删除</button>
        <button @click="poly.changeColor()">换色</button>
        <button @click="poly.toggleVisible()">{{ poly.isVisible ? '隐藏' : '显示' }}</button>
        <div v-if="poly.isFocus" class="highlight"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Polygon from '../models/Polygon'

export default {

  name: 'LeftBar',

  data: function () {
    return {
      newPolygonJSON: ''
    }
  },

  computed: {
    polygons () {
      return this.$store.state.polygons
    },
    error () {
      return Polygon.isErrorJson(this.newPolygonJSON)
    }
  },

  methods: {

    polyStyle (poly) {
      return { backgroundColor: poly.color }
    },

    focus (poly) {
      if (!poly.isVisible) return
      this.polygons.forEach(p => {
        p.isFocus = false
      })
      poly.isFocus = true
    },

    addRandomPolygon () {
      const newPolygon = Polygon.randomPolygon()
      this.$store.commit('update_polygons', [...this.polygons, newPolygon])
      this.focus(newPolygon)
    },

    addPolygon () {
      const newPolygon = new Polygon(this.newPolygonJSON)
      this.$store.commit('update_polygons', [...this.polygons, newPolygon])
      this.newPolygonJSON = ''
      this.focus(newPolygon)
    },

    handleDelete (poly) {
      this.$store.commit('update_polygons', this.polygons.filter(p => p.id !== poly.id))
    },

    clearPolygons () {
      this.$store.commit('update_polygons', [])
    }

  }
}

</script>

<style scoped>

.left-bar {
  background-color: white;
  height: 100vh;
  box-shadow: 4px 0 6px black;
  display: flex;
  flex-direction: column;
  min-width: 350px;
}

.input-container {
  margin: 10px 20px 10px 20px;
  border-bottom: 1px solid;
  height: 50px;
  min-height: 50px;
}

.error-tip {
  color: red;
  font-size: 12px;
}

.item-container {
  width: 100%;
  overflow-y: auto;
}

.item {
  padding-left: 0 20px 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  position: relative;
}

.item>input {
  border: none;
  background-color: rgba(0, 0, 0, 0);
  width: 80px;
}

.item>.highlight {
  position: absolute;
  right: 0;
  height: 50px;
  width: 10px;
  background-color: yellow;
}

</style>
