<template>
  <div id="app">
    <LeftBar/>
    <Content/>
  </div>
</template>

<script>
import LeftBar from "./LeftBar"
import Content from "./Content"
import store from "./store"

export default {
  components: {
    LeftBar,
    Content,
  },
  store,
}
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
