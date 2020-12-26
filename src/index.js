import Vue from 'vue'
import App from './components/App'
import store from './store'

window.onload = function () {
  App.el = document.body
  App.store = store
  // eslint-disable-next-line no-new
  new Vue(App)
}
