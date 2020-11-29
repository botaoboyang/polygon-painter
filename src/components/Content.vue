<template>
  <canvas id="canvas"></canvas>
</template>

<script>
import { mapState } from 'vuex'

const SCALE_SPEED = 0.1
const ZOOM_SPEED = 0.002

export default {

  data: function() {
    return {
      lastRenderTime: 0,

      translateX: 0,
      translateY: 0,
      scale: 1,

      controls: {
        left: false,
        right: false,
        up: false,
        down: false,
        zoomIn: false,
        zoomOut: false,
      },

    }
  },

  mounted: function() {
    this.canvas = document.getElementById("canvas")
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.ctx = canvas.getContext("2d")

    this.translateX = Math.floor(window.innerWidth / 2)
    this.translateY = Math.floor(window.innerHeight / 2)
    this.scale = 1

    window.onresize = this.handleResize
    window.onkeydown = this.handleKeyDown
    window.onkeyup = this.handleKeyUp

    window.requestAnimationFrame(this.render)
  },

  beforeDestroy: function() {
    window.onresize = null
    window.onkeydown = null
    window.onkeyup = null
  },

  computed: {
    ...mapState(['polygons']),
  },

  methods: {

    handleKeyDown(e) {
      if (e.code === "KeyW") this.controls.up = true
      else if(e.code === "KeyA") this.controls.left = true
      else if(e.code === "KeyS") this.controls.down = true
      else if(e.code === "KeyD") this.controls.right = true
      else if(e.code === "ArrowUp") this.controls.zoomIn = true
      else if(e.code === "ArrowDown") this.controls.zoomOut = true
    },

    handleKeyUp(e) {
      if (e.code === "KeyW") this.controls.up = false
      else if(e.code === "KeyA") this.controls.left = false
      else if(e.code === "KeyS") this.controls.down = false
      else if(e.code === "KeyD") this.controls.right = false
      else if(e.code === "ArrowUp") this.controls.zoomIn = false
      else if(e.code === "ArrowDown") this.controls.zoomOut = false
    },

    handleResize() {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
    },

    handleControls(elapsed) {
      if (this.controls.up) this.translateY += SCALE_SPEED * elapsed
      if (this.controls.down) this.translateY -= SCALE_SPEED * elapsed
      if (this.controls.left) this.translateX += SCALE_SPEED * elapsed
      if (this.controls.right) this.translateX -= SCALE_SPEED * elapsed
      if (this.controls.zoomIn) this.scale += ZOOM_SPEED * elapsed
      if (this.controls.zoomOut) this.scale -= ZOOM_SPEED * elapsed
    },

    render(timestamp) {
      let elapsed = timestamp - this.lastRenderTime
      this.lastRenderTime = timestamp
      this.handleControls(elapsed)
      this.renderBackground()
      this.renderPolygons()
      window.requestAnimationFrame(this.render)
    },

    renderBackground() {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.fillStyle = "#000000"
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    },
    
    renderPolygons() {
      this.ctx.setTransform(this.scale, 0, 0, this.scale, this.translateX, this.translateY)
      for (const poly of this.polygons) {
        if (poly.isValid) this.renderPolygon(poly)
      }
    },

    renderPolygon(polygon) {
      const points = polygon.data
      this.ctx.beginPath()
      this.ctx.strokeStyle = polygon.color
      this.ctx.lineWidth = 1 / this.scale
      
      this.ctx.moveTo(points[0].x, points[0].y)
      for (let i=1 ; i<points.length ; i++) {
        this.ctx.lineTo(points[i].x, points[i].y)
      }
      this.ctx.closePath()

      this.ctx.stroke()
    }
  
  }

}
</script>

<style scoped>

#canvas {
  display: block;
}

</style>