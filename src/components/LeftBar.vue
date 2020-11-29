<template>
  <div class="left-bar">
    <button @click="addRandomPolygon">随机</button>
    <button @click="clearPolygons">清除</button>
    <div>
      <input v-model="newPolygonJSON"/>
      <button @click="addPolygon">添加</button>
    </div>
    <div v-for="poly in polygons" :key="poly.id">
      <input :class="{invalid: !poly.isValid}" v-model="poly.json" @input="handleUpdate(poly)"/>
      <button @click="handleDelete(poly)">删除</button>
      <button @click="changeColor(poly)">换色</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {

  data: function () {
    return {
      polyJson: "",
      newPolygonJSON: "",
    }
  },

  computed: {
    ...mapState(['polygons'])
  },

  methods: {

    addPolygon() {
      const newPolygon = { json: this.newPolygonJSON }
      this.$store.commit("addPolygon", newPolygon)
      this.newPolygonJSON = ""
    },

    addRandomPolygon() {
      const points = [{
        x: Math.floor(Math.random() * 200),
        y: -Math.floor(Math.random() * 200)
      },
      {
        x: -Math.floor(Math.random() * 200),
        y: -Math.floor(Math.random() * 200)
      },
      {
        x: -Math.floor(Math.random() * 200),
        y: Math.floor(Math.random() * 200)
      },
      {
        x: Math.floor(Math.random() * 200),
        y: Math.floor(Math.random() * 200)
      }]

      const newPolygon = { 
        json: JSON.stringify(points),
        color: randomColor()
      }

      this.$store.commit("addPolygon", newPolygon)
    },

    handleUpdate(poly) {
      this.$store.commit("updatePolygon", poly)
    },

    handleDelete(poly) {
      this.$store.commit("popPolygon", poly.id)
    },

    changeColor(poly) {
      poly.color = randomColor();
    },

    clearPolygons() {
      this.$store.commit("clearPolygons")
    },

  }
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