<template>
  <div class="left-bar">
    <div class="input-container">
      <input v-model="newPolygonJSON"/>
      <button :disabled="error" @click="clickAdd">添加</button>
      <button @click="clickRandom">随机</button>
      <button @click="clickClear">删除全部</button>
      <button @click="clickHide">{{ allHidden ? '显示全部' : '隐藏全部' }}</button>
      <button @click="clickToggleGrid">网格</button>
    </div>
    <div class="error-tip">
      <span v-show="newPolygonJSON.length>0">{{ error }}</span>
    </div>
    <div class="item-container" v-show="polygons.length > 0">
      <div
        class="item"
        v-for="poly in polygons"
        :key="poly.id"
        :style="itemStyle(poly)"
        @mouseenter="focus(poly)"
        >
        <input v-model="poly.name" />
        <button @click="clickDelete(poly)">删除</button>
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
    showGrid () {
      return this.$store.state.showGrid
    },
    error () {
      return Polygon.isErrorJson(this.newPolygonJSON)
    },
    allHidden () {
      return this.polygons.length > 0 && this.polygons.filter(p => p.isVisible).length === 0
    }
  },

  methods: {

    itemStyle (poly) {
      if (poly.isVisible) {
        return {
          backgroundColor: poly.color
        }
      } else {
        return {
          border: `3px solid ${poly.color}`
        }
      }
    },

    focus (poly) {
      if (!poly.isVisible) return
      this.polygons.forEach(p => {
        p.isFocus = false
      })
      poly.isFocus = true
    },

    clickRandom () {
      const newPolygon = Polygon.randomPolygon()
      this.$store.commit('update_polygons', [newPolygon, ...this.polygons])
      this.focus(newPolygon)
    },

    clickAdd () {
      const newPolygon = new Polygon(this.newPolygonJSON)
      this.$store.commit('update_polygons', [newPolygon, ...this.polygons])
      this.newPolygonJSON = ''
      this.focus(newPolygon)
    },

    clickDelete (poly) {
      this.$store.commit('update_polygons', this.polygons.filter(p => p.id !== poly.id))
    },

    clickClear () {
      this.$store.commit('update_polygons', [])
    },

    clickHide () {
      const visible = this.allHidden
      this.polygons.forEach(p => {
        p.isVisible = visible
      })
    },

    clickToggleGrid () {
      this.$store.commit('update_showGrid', !this.showGrid)
    }

  }
}

</script>

<style scoped>

.left-bar {
  background-color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.input-container {
  margin: 10px 20px 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: baseline;
  width: max-content;
}

.input-container input {
  width: 40px;
}

.error-tip {
  margin: 0 20px 0 20px;
  min-height: 20px;
  color: red;
  font-size: 12px;
}

.item-container {
  width: 100%;
  overflow-y: auto;
  box-shadow: 0 0 5px 5px #888888;
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
