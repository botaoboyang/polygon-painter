import { uuid, randomColor } from '../utils'

class Polygon {
  id = uuid()
  label
  color = randomColor()
  data = {}
  isVisible = true

  constructor (data) {
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
}

export default Polygon
