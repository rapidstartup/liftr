//store/modules/auth.js

import axios from 'axios';
const state = {
  user: null,
  assignedClass:null,
};
const getters = {
  isAuthenticated: state => !!state.user,    
  StateUser: state => state.user,
};
const actions = {
  async Register({dispatch}, form) {
    await axios.post('user/signup', form)
    let UserForm = new FormData()
    UserForm.append('email', form.email)
    UserForm.append('password', form.password)
    await dispatch('LogIn', UserForm)
  },

  async LogIn({commit}, User) {
    const response = await axios.post('gym-schedule/client/login', User)
    await commit('setUser', response.data)
  },

  async LogOut({commit}){
    let user = null
    await axios.get('gym-schedule/client/logout');
    commit('logout', user)
  },

  async getAssignedClass({commit}){
    const response = await axios.get('gym-schedule/client/assigned/class')
    await commit('setClass', response.data);
  },

  async SetUser({commit}, data) {
    console.log(data)
    await commit('setUser', data)
  },
  

};
const mutations = {
  setUser(state, user){
      state.user = user
  },
  setClass(state, assignedClass){
      state.assignedClass = assignedClass
  },
  logout(state){
      state.user = null
      state.assignedClass = null
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
