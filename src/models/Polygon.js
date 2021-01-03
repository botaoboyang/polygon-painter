import { uuid, randomColor } from '../utils'

class Polygon {
  constructor (data) {
    this.id = uuid()
    this.color = randomColor()
    this.isVisible = true

    this.data = data
    if (Array.isArray(data)) {
      this.label = `Poly-${this.id}`
    } else {
      this.label = `Point-${this.id}`
    }
  }

  changeColor (color = randomColor()) {
    this.color = color
  }

  toggleVisible (v = !this.isVisible) {
    this.isVisible = v
  }

  static randomPolygon () {
    const data = [
      { x: Math.random() * 1000, y: Math.random() * 1000 },
      { x: Math.random() * 1000, y: -Math.random() * 1000 },
      { x: -Math.random() * 1000, y: -Math.random() * 1000 },
      { x: -Math.random() * 1000, y: Math.random() * 1000 }
    ]
    return new Polygon(data)
  }
}

export default Polygon
