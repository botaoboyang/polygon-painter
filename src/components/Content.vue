<template>
  <canvas id="canvas"></canvas>
</template>

<script>
import { mapState } from 'vuex'

const MOVE_SPEED = 0.2

const MIN_SCALE = 0.001
const SCALE_SPEED = 1.002

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
    this.ctx.textAlign = "left"
    this.ctx.textBaseline = "bottom"
    this.ctx.direction = "ltr"

    this.translateX = Math.floor(window.innerWidth / 2) + 150
    this.translateY = Math.floor(window.innerHeight / 2)
    this.scale = 1

    window.onresize = this.handleResize
    window.onkeydown = this.handleKeyDown
    window.onkeyup = this.handleKeyUp
    window.onscroll = this.handleScroll

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

    handleScroll(e) {
      console.log(e)
    },

    handleResize() {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
    },

    handleControls(elapsed) {
      if (this.controls.up) this.translateY += MOVE_SPEED * elapsed
      if (this.controls.down) this.translateY -= MOVE_SPEED * elapsed
      if (this.controls.left) this.translateX += MOVE_SPEED * elapsed
      if (this.controls.right) this.translateX -= MOVE_SPEED * elapsed
      if (this.controls.zoomIn) this.scale *= Math.pow(SCALE_SPEED, elapsed)
      if (this.controls.zoomOut) this.scale /= Math.pow(SCALE_SPEED, elapsed)

      if (this.scale < MIN_SCALE) this.scale = MIN_SCALE

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
      this.ctx.fillStyle = "black"
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    },
    
    renderPolygons() {
      this.ctx.setTransform(this.scale, 0, 0, -this.scale, this.translateX, this.translateY)
      this.ctx.lineWidth = 1 / this.scale

      const validPolygons = this.polygons.filter(p => p.isValid)

      for (const poly of validPolygons) {
        this.ctx.strokeStyle = poly.color
        try{
          this.renderPolygon(poly.data)
        } catch {
          poly.isValid = false
        }
      }

      this.ctx.setTransform(this.scale, 0, 0, this.scale, this.translateX, this.translateY)
      this.ctx.font = "10px serif"
      this.ctx.fillStyle = "white"
      for (const poly of validPolygons) {
        this.renderText(poly.data)
      }

    },

    renderPolygon(polygon) {
      if (Array.isArray(polygon[0])) {
        for (const poly of polygon) {
          this.renderPolygon(poly);
        }
        return;
      }

      this.ctx.beginPath()
      
      this.ctx.moveTo(polygon[0].x, polygon[0].y)
      for (let i=1 ; i<polygon.length ; i++) {
        this.ctx.lineTo(polygon[i].x, polygon[i].y)
      }
      this.ctx.closePath()

      this.ctx.stroke()
    },

    renderText(polygon) {
      if (Array.isArray(polygon[0])) {
        for (const poly of polygon) {
          this.renderText(poly);
        }
        return;
      }

      for (let i=0 ; i<polygon.length ; i++) {
        this.ctx.fillText(i, polygon[i].x + 10 / this.scale, -polygon[i].y - 5 / this.scale)
      }
    }
  
  }

}
</script>

<style scoped>

#canvas {
  display: block;
}

</style>