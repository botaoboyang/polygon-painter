<template>
  <div class="left-bar">
    <button @click="addRandomPolygon">随机</button>
    <button @click="clearPolygons">清除</button>
    <div>
      <input v-model="newPolygonJSON"/>
      <button @click="addPolygon">添加</button>
    </div>
    <div v-for="poly in polygons" :key="poly.id">
      <input @focus="focus(poly)" :class="{invalid: !poly.isValid}" type="text" v-model="poly.json"/>
      <button @click="handleDelete(poly)">删除</button>
      <button @focus="focus(poly)" @click="poly.changeColor()">换色</button>
      <button @focus="focus(poly)" @click="poly.toggleVisible()">{{ poly.isVisible ? '隐藏' : '显示' }}</button>
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
      newPolygonJSON: "",
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

function randomPolygon(offsetX, offsetY) {
  return [{
    x: Math.floor(Math.random() * 200) + offsetX,
    y: -Math.floor(Math.random() * 200) + offsetY
  },
  {
    x: -Math.floor(Math.random() * 200) + offsetX,
    y: -Math.floor(Math.random() * 200) + offsetY
  },
  {
    x: -Math.floor(Math.random() * 200) + offsetX,
    y: Math.floor(Math.random() * 200) + offsetY
  },
  {
    x: Math.floor(Math.random() * 200) + offsetX,
    y: Math.floor(Math.random() * 200) + offsetY
  }]
}

function randomColor() {
  let r, g, b;
  do {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
  } while (r + g + b < 100);
  return `rgb(${r}, ${g}, ${b})`;
}

</script>

<style scoped>

.left-bar {
  background-color: white;
  width: 300px;
  height: 100%;
  position: absolute;
  box-shadow: 4px 0 6px black;
  overflow-y: auto;
}

.invalid {
  border-color: red;
  border-style: solid;
}

</style>