export default class {
  canvas = null;
  ctx = null;
  constructor (canvas) {
    this.canvas = canvas
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight

    this.ctx = this.canvas.getContext('2d')
    this.ctx.textAlign = 'left'
    this.ctx.textBaseline = 'top'
    this.ctx.direction = 'ltr'

    this.translateX = Math.floor(this.canvas.width / 2) / this.scale
    this.translateY = Math.floor(this.canvas.height / 2) / this.scale

    document.addEventListener('resize', this.handleResize)
    document.addEventListener('keydown', this.handleKeydown)
    document.addEventListener('keyup', this.handleKeyup)

    this.canvas.addEventListener('wheel', this.handleWheel)
    this.canvas.addEventListener('mousedown', this.handleMousedown)
    this.canvas.addEventListener('mousemove', this.handleMousemove)
    document.addEventListener('mouseup', this.handleMouseup)
  }
}
