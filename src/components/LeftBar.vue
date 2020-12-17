<template>
  <div class="left-bar">
    <div class="item">
      <input v-model="newPolygonJSON"/>
      <button :disabled="!isValid" @click="addPolygon">添加</button>
      <button @click="clearPolygons">清除所有</button>
    </div>
    <div v-show="!isValid && newPolygonJSON.length>0" class="item error-tip">
      数据格式不正确
    </div>
    <div 
      class="item" 
      v-for="poly in polygons"
      :key="poly.id"
      :class="{isFocus: poly.isFocus}"
      @mouseenter="focus(poly)"
      >
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
  height: 100%;
  position: absolute;
  box-shadow: 4px 0 6px black;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.item {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 20px;
}

.item.error-tip {
  color: red;
  font-size: 12px;
}

.item.isFocus {
  background-color: #eeeeee;
}


</style>
