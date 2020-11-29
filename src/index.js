import "./style.css"

import Vue from "vue"
import App from "./components/App"

window.Vue = Vue
window.App = App

window.onload = function () {
  App.el = document.body
  new Vue(App)
}
