let currentId = 0;

class Polygon {

  static randomPolygon() {
    const points = randomPolygon(
      Math.floor(Math.random() * 400 - 200), 
      Math.floor(Math.random() * 400 - 200)
    );
    return new Polygon(points);
  }

  static isValidJson(json) {
    try {
      const data = JSON.parse(json.toLowerCase())
      return Polygon.isValidData(data)
    } catch {
      return false
    }
  }

  static isValidData(data) {
    if (Array.isArray(data)) {
      for (const item of data) {
        if (!Polygon.isValidData(item)) return false
      }
    } else {
      return typeof(data.x) === 'number' && typeof(data.y) === 'number'
    }
  }

  constructor(data) {
    if (typeof(data) == 'string') {
      data = JSON.parse(data.toLowerCase())
    }
    this.data = data
    this.id = currentId++;
    this.name = `多边形${currentId}`
    this.color = randomColor();
    this.isVisible = true;
    this.isFocus = false;
  }

  changeColor() {
    this.color = randomColor();
  }

  toggleVisible() {
    this.isVisible = !this.isVisible;
  }

}

function randomPolygon(offsetX, offsetY) {
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

function randomColor() {
  let r, g, b;
  do {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
  } while (r + g + b < 200);
  return `rgb(${r}, ${g}, ${b})`;
}

export default Polygon;
