<template>
  <div class="left-bar">
    <div class="input-container">
      <input v-model="newPolygonJSON"/>
      <button :disabled="!isValid" @click="addPolygon">添加</button>
      <button @click="clearPolygons">清除所有</button>
      <div v-show="!isValid && newPolygonJSON.length>0" class="error-tip">
        数据格式不正确
      </div>
    </div>
    <div 
      class="item" 
      v-for="poly in polygons"
      :key="poly.id"
      :class="{isFocus: poly.isFocus}"
      @mouseenter="focus(poly)"
      >
      <input v-model="poly.name" />
      <button @click="handleDelete(poly)">删除</button>
      <button @click="poly.changeColor()">换色</button>
      <button @click="poly.toggleVisible()">{{ poly.isVisible ? '隐藏' : '显示' }}</button>
    </div>
  </div>
</template>

<script>
import Polygon from '../Polygon';

export default {

  name: "LeftBar",

  props: {
    polygons: Array,
  },

  data: function () {
    window.LeftBar = this
    return {
      newPolygonJSON: ""
    }
  },

  computed: {
    isValid () {
      return Polygon.isValidJson(this.newPolygonJSON)
    }
  },

  methods: {

    focus(poly) {
      this.polygons.forEach(p => p.isFocus = false);
      poly.isFocus = true;
    },

    addRandomPolygon() {
      const newPolygon = Polygon.randomPolygon();
      this.polygons.push(newPolygon);
      this.focus(newPolygon);
    },

    addPolygon() {
      const newPolygon = new Polygon(this.newPolygonJSON);
      this.polygons.push(newPolygon);
      this.newPolygonJSON = "";
      this.focus(newPolygon);
    },

    handleDelete(poly) {
      this.$emit('update:polygons', this.polygons.filter(p => p.id !== poly.id))
    },

    clearPolygons() {
      this.$emit('update:polygons', [])
    },

  }
}

</script>

<style scoped>

.left-bar {
  background-color: white;
  height: calc(100vh - 20px);
  position: absolute;
  box-shadow: 4px 0 6px black;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 10px 0 10px 0;
  min-width: 350px;
}

.input-container {
  margin: 10px 20px 10px 20px;
  border-bottom: 1px solid;
  height: 50px;
}

.error-tip {
  color: red;
  font-size: 12px;
}

.item {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 40px;
}

.item>:first-child {
  margin-left: 20px;
}
.item>:last-child {
  margin-right: 20px;
}

.item>input {
  border: none;
}

.item.isFocus {
  background-color: #eeeeee;
}
.item.isFocus>input {
  background-color: #eeeeee;
}


</style>
