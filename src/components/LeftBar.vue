<template>
  <div class="left-bar">
    <div class="input-container">
      <el-input v-model="newPolygonJSON" placeholder="请输入" clearable>
        <el-button type="primary" slot="append" icon="el-icon-plus" @click="clickAdd"></el-button>
      </el-input>
    </div>

    <div class="button-container">
      <el-button type="primary" @click="clickRandom">随机</el-button>
      <el-button type="primary" @click="toggle_showGrid">网格</el-button>
    </div>

    <div class="button-container">
      <el-button type="primary" plain icon="el-icon-back" @click="undo" :disabled="!canUndo"></el-button>
      <el-button type="primary" plain icon="el-icon-right" @click="redo" :disabled="!canRedo"></el-button>
      <el-button type="danger" icon="el-icon-delete" @click="clickClear"></el-button>
      <el-button type="primary" icon="el-icon-view" @click="clickHide"></el-button>
    </div>

    <div class="item-container" v-show="polygons.length > 0">
      <div
        class="item"
        v-for="poly in polygons"
        :key="poly.id"
        :style="itemStyle(poly)"
      >
        <input v-model="poly.label" />
        <button @click="clickDelete(poly)">删除</button>
        <button @click="poly.changeColor()">换色</button>
        <button @click="poly.toggleVisible()">{{ poly.isVisible ? '隐藏' : '显示' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import Polygon from '../models/Polygon'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {

  name: 'LeftBar',

  data: function () {
    return {
      newPolygonJSON: ''
    }
  },

  computed: {
    ...mapState(['polygons', 'showGrid']),
    ...mapGetters(['canUndo', 'canRedo']),
    error () {
      return Polygon.isErrorJson(this.newPolygonJSON)
    },
    allHidden () {
      return this.polygons.length > 0 && this.polygons.filter(p => p.isVisible).length === 0
    }
  },

  methods: {

    ...mapMutations(['undo', 'redo', 'toggle_showGrid']),

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

    clickRandom () {
      const newPolygon = Polygon.randomPolygon()
      this.$store.commit('update_polygons', [newPolygon, ...this.polygons])
    },

    clickAdd () {
      try {
        const data = JSON.parse(this.newPolygonJSON)
        const newPolygon = new Polygon(data)
        this.$store.commit('update_polygons', [newPolygon, ...this.polygons])
        this.newPolygonJSON = ''
      } catch {
        this.$message.error('添加失败，请检查数据')
      }
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
    }

  }
}

</script>

<style scoped>

button {
  white-space: nowrap;
}

.left-bar {
  background-color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  min-width: 300px;
}

.input-container {
  margin: 10px 20px 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: baseline;
}

.button-container {
  margin: 10px 20px 10px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: baseline;
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
  margin-top: 10px;
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

</style>
