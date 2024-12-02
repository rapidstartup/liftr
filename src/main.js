import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from 'axios';
import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
import { ToggleButton } from 'vue-js-toggle-button'
import VueChatScroll from "vue-chat-scroll/dist/vue-chat-scroll";
import moment from "moment";
Vue.use(VueChatScroll);

window.toastr = require('toastr')


import "./style.css"
require("@fortawesome/fontawesome-free/css/all.css");
require("@fortawesome/fontawesome-free/js/all.js");

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'https://tc.leadgrown.com/api/';

axios.interceptors.request.use(function (config) {
    const token = store.getters.StateUser && store.getters.StateUser.data.access_token;
    config.headers.Authorization =  "Bearer "+token;

    return config;
});
axios.interceptors.response.use(undefined, function (error) {
  if (error) {
    window.toastr.error(error.response.data.message, null, {timeOut: 1000, positionClass: 'toast-bottom-center'});
    if (error.response.status === 401 && router.history.current.name!=='login') {
        store.dispatch('LogOut')
        return router.push('/login');
    }
    else {
      return null;
    }

  }
})

Vue.use(VueToastr2)
Vue.component('ToggleButton', ToggleButton)
Vue.config.productionTip = false;
Vue.prototype.$screen = new Vue({
  data: {
      screen: {
          width: window.innerWidth,
          height: window.innerHeight,
          isMobileView:false
      }
  }
}).screen;

window.addEventListener('load', ()=>{
  Vue.prototype.$screen.width = window.innerWidth;
  Vue.prototype.$screen.height = window.innerHeight;
  Vue.prototype.$screen.isMobileView = (window.innerWidth <= 735);
});

window.addEventListener('resize', () => {
  Vue.prototype.$screen.width = window.innerWidth;
  Vue.prototype.$screen.height = window.innerHeight;
  Vue.prototype.$screen.isMobileView = (window.innerWidth <= 735);
});


Vue.filter('formatChatTimeStamp', function(value) {
  if (value) {
      return moment.utc(value).local().format('hh:mm A')
  }
});

Vue.filter('formatRecentTimeStamp', function(value) {
  if (value) {
      return moment.utc(value).local().format('hh:mm A')
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
