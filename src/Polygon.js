let currentId = 0

class Polygon {
  static randomPolygon () {
    const points = randomPolygon(
      Math.floor(Math.random() * 400 - 200),
      Math.floor(Math.random() * 400 - 200)
    )
    return new Polygon(points)
  }

  static isErrorJson (json) {
    try {
      const data = JSON.parse(json.toLowerCase())
      return Polygon.isErrorData(data)
    } catch (e) {
      return '不符合JSON格式'
    }
  }

  static isErrorData (data) {
    if (Array.isArray(data)) {
      for (const item of data) {
        const err = Polygon.isErrorData(item)
        if (err) return err
      }
    } else {
      if (typeof (data.x) !== 'number' || typeof (data.y) !== 'number') {
        return `${JSON.stringify(data)} 不符合格式`
      }
    }
  }

  constructor (data) {
    if (typeof (data) === 'string') {
      data = JSON.parse(data.toLowerCase())
    }
    this.data = data
    this.id = currentId++
    this.name = `多边形${currentId}`
    this.color = randomColor()
    this.isVisible = true
    this.isFocus = false
  }

  changeColor () {
    this.color = randomColor()
  }

  toggleVisible () {
    this.isVisible = !this.isVisible
  }
}

function randomPolygon (offsetX, offsetY) {
  return [{
    x: Math.floor(Math.random() * 200) + offsetX,
    y: -Math.floor(Math.random() * 200) + offsetY
  },
  {
    x: -Math.floor(Math.random() * 200) + offsetX,
    y: -Math.floor(Math.random() * 200) + offsetY
  },
  {
    x: -Math.floor(Math.random() * 200) + offsetX,
    y: Math.floor(Math.random() * 200) + offsetY
  },
  {
    x: Math.floor(Math.random() * 200) + offsetX,
    y: Math.floor(Math.random() * 200) + offsetY
  }]
}

function randomColor () {
  let r, g, b
  do {
    r = Math.floor(Math.random() * 256)
    g = Math.floor(Math.random() * 256)
    b = Math.floor(Math.random() * 256)
  } while (r + g + b < 200)
  return `rgb(${r}, ${g}, ${b})`
}

export default Polygon
