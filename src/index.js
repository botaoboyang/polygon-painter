import './style.css'

import Vue from 'vue'
import App from './components/App'

window.onload = function () {
  App.el = document.body
  // eslint-disable-next-line no-new
  new Vue(App)
}
