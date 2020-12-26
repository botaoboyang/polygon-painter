function randomColor () {
  let r, g, b
  do {
    r = Math.floor(Math.random() * 256)
    g = Math.floor(Math.random() * 256)
    b = Math.floor(Math.random() * 256)
  } while (r * 0.299 + g * 0.587 + b * 0.114 < 100)
  return `rgb(${r}, ${g}, ${b})`
}

function taggedTemplateMaker (parseFunction) {
  return function (stringArr, ...values) {
    const result = []
    for (let i = 0; i < stringArr.length; i++) {
      result.push(stringArr[i])
      if (i < values.length) result.push(parseFunction(values[i]).toString())
    }
    return result.join('')
  }
}

export {
  randomColor,
  taggedTemplateMaker
}
