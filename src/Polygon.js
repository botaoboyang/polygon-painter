let currentId = 0;

class Polygon {

  static randomPolygon() {
    const points = randomPolygon(
      Math.floor(Math.random() * 400 - 200), 
      Math.floor(Math.random() * 400 - 200)
    );
    return new Polygon(JSON.stringify(points));
  }

  constructor(json) {
    this.id = currentId++;
    this.color = randomColor();
    this.isValid = true;
    this.isVisible = true;
    this.isFocus = false;
    this.json = json;
  }

  get json() {
    return this._json
  }

  set json(v) {
    this._json = v
    try {
      this.data = JSON.parse(v.toLowerCase());
      this.isValid = true;
    } catch {
      this.isValid = false;
    }
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
  } while (r + g + b < 100);
  return `rgb(${r}, ${g}, ${b})`;
}

export default Polygon;
