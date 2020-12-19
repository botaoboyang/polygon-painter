<template>
  <div id="app">
    <LeftBar/>
    <Content/>
  </div>
</template>

<script>
import LeftBar from './LeftBar'
import Content from './Content'

export default {
  components: {
    LeftBar,
    Content
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
