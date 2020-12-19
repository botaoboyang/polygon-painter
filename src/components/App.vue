<template>
  <div id="app">
    <LeftBar :polygons.sync="polygons"/>
    <Content :polygons="polygons"/>
  </div>
</template>

<script>
import LeftBar from './LeftBar'
import Content from './Content'

export default {
  components: {
    LeftBar,
    Content
  },
  data () {
    return {
      polygons: []
    }
  }
}
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
}
</style>
