<template>
  <canvas id="canvas"></canvas>
</template>

<script>
import { mapState } from 'vuex'
import { taggedTemplateMaker } from '../utils'

const r = taggedTemplateMaker(v => v.toFixed(2))

const MOVE_SPEED = 0.3

const MIN_SCALE = 0.001
const SCALE_SPEED = 1.002

const GRID_COLOR = '#eeeeee'
const GRID_SIZE = 100
const GRID_WIDTH = 5000

export default {

  name: 'Content',

  computed: {
    ...mapState(['polygons', 'showGrid', 'showStats']),
    transform () {
      return [this.scale, 0, 0, -this.scale, this.translateX * this.scale, this.translateY * this.scale]
    },
    mouse () {
      return this.toRealCoords({ x: this.mouseX, y: this.mouseY })
    }
  },

  data: function () {
    return {
      lastRenderTime: 0,

      translateX: 0,
      translateY: 0,
      scale: 1,

      mouseX: 0,
      mouseY: 0,

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
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight

    this.ctx = this.canvas.getContext('2d')
    this.ctx.textAlign = 'left'
    this.ctx.textBaseline = 'top'
    this.ctx.direction = 'ltr'

    this.translateX = Math.floor(this.canvas.width / 2) / this.scale
    this.translateY = Math.floor(this.canvas.height / 2) / this.scale

    window.addEventListener('resize', this.handleResize)
    window.addEventListener('keydown', this.handleKeydown)
    window.addEventListener('keyup', this.handleKeyup)

    this.canvas.addEventListener('wheel', this.handleWheel)
    this.canvas.addEventListener('mousedown', this.handleMousedown)
    this.canvas.addEventListener('mousemove', this.handleMousemove)
    window.addEventListener('mouseup', this.handleMouseup)

    requestAnimationFrame(this.render)
  },

  methods: {

    toCanvasCoords ({ x, y }) {
      const [xScale, , , yScale, xOffset, yOffset] = this.transform
      return {
        x: x * xScale + xOffset,
        y: y * yScale + yOffset
      }
    },

    toRealCoords ({ x, y }) {
      return {
        x: x / this.scale - this.translateX,
        y: -this.mouseY / this.scale + this.translateY
      }
    },

    handleKeydown (e) {
      if (e.code === 'KeyW') this.controls.up = true
      else if (e.code === 'KeyA') this.controls.left = true
      else if (e.code === 'KeyS') this.controls.down = true
      else if (e.code === 'KeyD') this.controls.right = true
      else if (e.code === 'ArrowUp') this.controls.zoomIn = true
      else if (e.code === 'ArrowDown') this.controls.zoomOut = true
    },

    handleKeyup (e) {
      if (e.code === 'KeyW') this.controls.up = false
      else if (e.code === 'KeyA') this.controls.left = false
      else if (e.code === 'KeyS') this.controls.down = false
      else if (e.code === 'KeyD') this.controls.right = false
      else if (e.code === 'ArrowUp') this.controls.zoomIn = false
      else if (e.code === 'ArrowDown') this.controls.zoomOut = false
    },

    handleMousedown (e) {
      this.controls.mousedown = true
      const { offsetX: x, offsetY: y } = e

      this.controls.mousedownX = x
      this.controls.mousedownY = y
    },

    handleMousemove (e) {
      const { offsetX: x, offsetY: y } = e
      this.mouseX = x
      this.mouseY = y

      if (!this.controls.mousedown) return

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

    handleWheel (e) {
      this.mouseX = e.offsetX
      this.mouseY = e.offsetY
      this.zoom(-e.deltaY)
    },

    zoom (delta) {
      const r = Math.pow(SCALE_SPEED, delta)
      this.scale *= r
      this.translateX += this.mouseX * (1 - r) / this.scale
      this.translateY += this.mouseY * (1 - r) / this.scale
    },

    handleResize () {
      this.canvas.width = this.canvas.offsetWidth
      this.canvas.height = this.canvas.offsetHeight
    },

    handleControls (elapsed) {
      if (this.controls.up) this.translateY += MOVE_SPEED / this.scale * elapsed
      if (this.controls.down) this.translateY -= MOVE_SPEED / this.scale * elapsed
      if (this.controls.left) this.translateX += MOVE_SPEED / this.scale * elapsed
      if (this.controls.right) this.translateX -= MOVE_SPEED / this.scale * elapsed
      if (this.controls.zoomIn) this.zoom(elapsed)
      if (this.controls.zoomOut) this.zoom(-elapsed)

      if (this.scale < MIN_SCALE) this.scale = MIN_SCALE
    },

    render (timestamp) {
      const elapsed = timestamp - this.lastRenderTime
      this.lastRenderTime = timestamp
      this.handleControls(elapsed)
      this.renderBackground()
      if (this.showStats) this.renderStats()
      if (this.showGrid) this.renderGrid()
      this.renderPolygons()
      window.requestAnimationFrame(this.render)
    },

    renderBackground () {
      this.ctx.resetTransform()
      this.ctx.fillStyle = 'black'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    },

    renderGrid () {
      this.ctx.setTransform(...this.transform)

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

    renderStats () {
      this.ctx.resetTransform()
      this.ctx.fillStyle = 'white'
      this.ctx.font = '16px serif'
      this.ctx.fillText(r`scale: ${this.scale}`, 10, 10)
      this.ctx.fillText(r`translate x: ${this.translateX}`, 10, 30)
      this.ctx.fillText(r`translate y: ${this.translateY}`, 10, 50)
      this.ctx.fillText(r`x: ${this.mouse.x}`, 10, 70)
      this.ctx.fillText(r`y: ${this.mouse.y}`, 10, 90)
      this.ctx.fillText(r`size: ${this.canvas.width / this.scale} * ${this.canvas.height / this.scale}`, 10, 110)
    },

    renderPolygons () {
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

    renderPoint (point) {
      this.ctx.resetTransform()
      const { x, y } = this.toCanvasCoords(point.data)

      this.ctx.fillStyle = point.color
      this.ctx.beginPath()
      this.ctx.arc(x, y, 3, 0, 2 * Math.PI)
      this.ctx.fill()

      this.ctx.fillStyle = 'white'
      this.ctx.font = '16px serif'
      this.ctx.fillText(point.name, x, y)
    },

    renderPolygon (polygon) {
      if (!Array.isArray(polygon.data)) {
        this.renderPoint(polygon)
        return
      }
      this.ctx.setTransform(...this.transform)
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
      this.ctx.resetTransform()
      this.ctx.fillStyle = 'white'
      this.ctx.font = '16px serif'
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
        const { x, y } = this.toCanvasCoords(polygon[i])
        this.ctx.fillText(i, x, y)
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
