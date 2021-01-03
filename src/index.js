import Vue from 'vue'
import App from './components/App'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

window.App = new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
