import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import API_BASE_URL from '@/config';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    clientsDatabase: [],
  },
  getters: {
    getClientsInfo(state) {
      return state.clientsDatabase;
    }
  },
  mutations: {
    addNewClient(state, newClient) {
      state.clientsDatabase.push(newClient);
    },
    deleteClient(state, id) {
      const indexToDelete = state.clientsDatabase.findIndex(element => element.id === id);
      if (indexToDelete !== -1) {
        state.clientsDatabase.splice(indexToDelete, 1);
      }
    },
    updateClient(state, updatedClient) {
      const indexToUpdate = state.clientsDatabase.findIndex(element => element.id === updatedClient.id);
      if (indexToUpdate !== -1) {
        //state.clientsDatabase[indexToUpdate] = updatedClient;
        //Vue.set( state.clientsDatabase[indexToUpdate], updatedClient);
        state.clientsDatabase.splice(indexToUpdate, 1, updatedClient);
      }
    }
  },
  actions: {
    loadClients(state, searchValue) {
      console.log(searchValue);
      setTimeout(() => {
        axios.get(API_BASE_URL + 'api/clients', {
          params: {
            search: searchValue,
          }
        })
          .then((responce) => {
            this.state.clientsDatabase = responce.data;
          })
      }
      , 300);        
    },
    deleteClient(state, { id }) {
      axios.delete(API_BASE_URL + 'api/clients/' + id)
        .then(() => {
          this.commit('deleteClient', id);
        })
    },

  },
  modules: {
  }
})
