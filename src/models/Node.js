import { uuid, randomColor } from '../utils'

class Node {
  id = uuid()
  label = `Node-${this.id}`
  children = []
  isVisible = true

  changeColor (color = randomColor()) {
    this.children.forEach(p => {
      p.changeColor(color)
    })
  }

  toggleVisible (v = !this.isVisible) {
    this.isVisible = v
    this.children.forEach(p => {
      p.toggleVisible(v)
    })
  }
}

export default Node
