<template>
  <canvas id="canvas"></canvas>
</template>

<script>
const MOVE_SPEED = 0.3

const MIN_SCALE = 0.001
const SCALE_SPEED = 1.002

const GRID_COLOR = '#eeeeee'
const GRID_SIZE = 100
const GRID_WIDTH = 5000

export default {

  name: 'Content',

  computed: {
    polygons () {
      return this.$store.state.polygons
    },
    showGrid () {
      return this.$store.state.showGrid
    }
  },

  data: function () {
    return {
      lastRenderTime: 0,

      centerX: 0,
      centerY: 0,

      translateX: 0,
      translateY: 0,
      scale: 0.5,

      controls: {
        left: false,
        right: false,
        up: false,
        down: false,
        zoomIn: false,
        zoomOut: false,

        mousedown: false,
        mousedownX: 0,
        mousedownY: 0
      }

    }
  },

  mounted: function () {
    this.canvas = document.getElementById('canvas')
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight

    this.ctx = this.canvas.getContext('2d')
    this.ctx.textAlign = 'left'
    this.ctx.textBaseline = 'bottom'
    this.ctx.direction = 'ltr'

    this.centerX = Math.floor(this.canvas.width / 2)
    this.centerY = Math.floor(this.canvas.height / 2)

    window.onresize = this.handleResize
    window.onkeydown = this.handleKeyDown
    window.onkeyup = this.handleKeyUp
    this.canvas.addEventListener('wheel', this.handleScroll)
    this.canvas.addEventListener('mousedown', this.handleMousedown)
    this.canvas.addEventListener('mousemove', this.handleMousemove)
    window.addEventListener('mouseup', this.handleMouseup)

    window.requestAnimationFrame(this.render)
  },

  methods: {

    handleKeyDown (e) {
      if (e.code === 'KeyW') this.controls.up = true
      else if (e.code === 'KeyA') this.controls.left = true
      else if (e.code === 'KeyS') this.controls.down = true
      else if (e.code === 'KeyD') this.controls.right = true
      else if (e.code === 'ArrowUp') this.controls.zoomIn = true
      else if (e.code === 'ArrowDown') this.controls.zoomOut = true
    },

    handleKeyUp (e) {
      if (e.code === 'KeyW') this.controls.up = false
      else if (e.code === 'KeyA') this.controls.left = false
      else if (e.code === 'KeyS') this.controls.down = false
      else if (e.code === 'KeyD') this.controls.right = false
      else if (e.code === 'ArrowUp') this.controls.zoomIn = false
      else if (e.code === 'ArrowDown') this.controls.zoomOut = false
    },

    handleMousedown (e) {
      this.controls.mousedown = true
      const { clientX: x, clientY: y } = e

      this.controls.mousedownX = x
      this.controls.mousedownY = y
    },

    handleMousemove (e) {
      if (!this.controls.mousedown) return
      const { clientX: x, clientY: y } = e

      const offsetX = x - this.controls.mousedownX
      const offsetY = y - this.controls.mousedownY

      this.translateX += offsetX / this.scale
      this.translateY += offsetY / this.scale

      this.controls.mousedownX = x
      this.controls.mousedownY = y
    },

    handleMouseup (e) {
      this.controls.mousedown = false
    },

    handleScroll (e) {
      this.scale /= Math.pow(SCALE_SPEED, e.deltaY)
    },

    handleResize () {
      this.canvas.width = this.canvas.clientWidth
      this.canvas.height = this.canvas.clientHeight
    },

    handleControls (elapsed) {
      if (this.controls.up) this.translateY += MOVE_SPEED / this.scale * elapsed
      if (this.controls.down) this.translateY -= MOVE_SPEED / this.scale * elapsed
      if (this.controls.left) this.translateX += MOVE_SPEED / this.scale * elapsed
      if (this.controls.right) this.translateX -= MOVE_SPEED / this.scale * elapsed
      if (this.controls.zoomIn) this.scale *= Math.pow(SCALE_SPEED, elapsed)
      if (this.controls.zoomOut) this.scale /= Math.pow(SCALE_SPEED, elapsed)

      if (this.scale < MIN_SCALE) this.scale = MIN_SCALE
    },

    render (timestamp) {
      const elapsed = timestamp - this.lastRenderTime
      this.lastRenderTime = timestamp
      this.handleControls(elapsed)
      this.renderBackground()
      if (this.showGrid) this.renderGrid()
      this.renderPolygons()
      window.requestAnimationFrame(this.render)
    },

    renderBackground () {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.fillStyle = 'black'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    },

    renderGrid () {
      this.ctx.setTransform(this.scale, 0, 0, -this.scale,
        this.translateX * this.scale + this.centerX,
        this.translateY * this.scale + this.centerY
      )

      this.ctx.strokeStyle = GRID_COLOR
      this.ctx.lineWidth = 1 / this.scale

      this.ctx.beginPath()

      for (let x = -GRID_WIDTH; x <= GRID_WIDTH; x += GRID_SIZE) {
        this.ctx.moveTo(x, -GRID_WIDTH)
        this.ctx.lineTo(x, GRID_WIDTH)
      }

      for (let y = -GRID_WIDTH; y <= GRID_WIDTH; y += GRID_SIZE) {
        this.ctx.moveTo(-GRID_WIDTH, y)
        this.ctx.lineTo(GRID_WIDTH, y)
      }

      this.ctx.closePath()
      this.ctx.stroke()
    },

    renderPolygons () {
      this.ctx.setTransform(this.scale, 0, 0, -this.scale,
        this.translateX * this.scale + this.centerX,
        this.translateY * this.scale + this.centerY
      )

      const visiblePolygons = this.polygons.filter(p => p.isVisible)

      for (const poly of visiblePolygons) {
        if (poly.isFocus) continue
        this.renderPolygon(poly)
      }

      const focusPolygon = visiblePolygons.find(p => p.isFocus)
      if (focusPolygon) {
        this.renderPolygon(focusPolygon)
        this.renderText(focusPolygon)
      }
    },

    renderPolygon (polygon) {
      this.ctx.strokeStyle = polygon.color
      this.ctx.lineWidth = (polygon.isFocus ? 2 : 1) / this.scale
      this.renderPolygonRec(polygon.data)
    },

    renderPolygonRec (polygon) {
      if (Array.isArray(polygon[0])) {
        for (const poly of polygon) {
          this.renderPolygonRec(poly)
        }
        return
      }

      this.ctx.beginPath()

      this.ctx.moveTo(polygon[0].x, polygon[0].y)
      for (let i = 1; i < polygon.length; i++) {
        this.ctx.lineTo(polygon[i].x, polygon[i].y)
      }
      this.ctx.closePath()

      this.ctx.stroke()
    },

    renderText (polygon) {
      this.ctx.setTransform(this.scale, 0, 0, this.scale,
        this.translateX * this.scale + this.centerX,
        this.translateY * this.scale + this.centerY
      )
      this.ctx.fillStyle = 'white'
      const fontSize = 16 / this.scale
      this.ctx.font = `${fontSize}px serif`
      this.renderTextRec(polygon.data)
    },

    renderTextRec (polygon) {
      if (Array.isArray(polygon[0])) {
        for (const poly of polygon) {
          this.renderTextRec(poly)
        }
        return
      }

      for (let i = 0; i < polygon.length; i++) {
        this.ctx.fillText(i, polygon[i].x, -polygon[i].y)
      }
    }

  }

}
</script>

<style scoped>

#canvas {
  display: block;
  width: 100%;
  height: 100vh;
}

</style>
