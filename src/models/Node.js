import { uuid, randomColor } from '../utils'

class Node {
  constructor () {
    this.id = uuid()
    this.label = `Node-${this.id}`
    this.children = []
    this.isVisible = true
  }

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
