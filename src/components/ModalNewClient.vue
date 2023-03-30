<template>
  <div class="modal-window" :class="{ 'modal-window--open': true }" v-if="open">
    <div class="modal-blackout"></div>
    <div class="modal">
      <div ref="content" class="modal_content">
        <div class="modal-header">
          <h2 class="modal_content-title">Новый клиент</h2>
          <button class="btn-cls" @click="hideModal">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M16.2332 1.73333L15.2665 0.766664L8.49985 7.53336L1.73318 0.766696L0.766515 1.73336L7.53318 8.50003L0.766542 
                       15.2667L1.73321 16.2333L8.49985 9.46669L15.2665 16.2334L16.2332 15.2667L9.46651 8.50003L16.2332 1.73333Z" fill="#B0B0B0" />
            </svg>
          </button>
        </div>

        <form class="form-newclient">
          <div class="form-group">
            <input class="form-name" type="text" name="surname" required v-model="newClientData.surname">
            <div class="placeholder">
              Фамилия <span>*</span>
            </div>
          </div>
          <div class="form-group">
            <input class="form-name" type="text" name="name" required v-model="newClientData.name">
            <div class="placeholder">
              Имя <span>*</span>
            </div>
          </div>
          <div class="form-group">
            <input class="form-name" type="text" name="lastname" v-model="newClientData.lastName">
            <div class="placeholder">
              Отчество
            </div>
          </div>
        </form>
        <div class="contacts-space" :class="{'no-margin' : errors}">
          <ContactField v-model="contacts" :contacts="contacts" @add-contact="addContact"
            @delete-contact="deleteContact" />
        </div>
        <div class="modal-footer">
          <div :class="{ 'footer-error': true, 'footer-error--show': errors }">
            <p v-for="(error, index) in errors" :key="index">
              {{ 'Ошибка: ' + error.message }}
            </p>
          </div>
          <button class="btn-savecontact" @click.prevent="addNewClientInfo"> Сохранить </button>
          <button class="btn-delelecontact" @click="hideModal"> Отмена </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import ContactField from '@/components/ContactField.vue'
import axios from 'axios';
import API_BASE_URL from '@/config';
import { mapMutations } from 'vuex';

export default {
  props: ['open'],
  data() {
    return {
      newClientData: [],
      contacts: [],
      errors: null,
    }
  },
  components: {
    ContactField,
  },
  methods: {
    ...mapMutations([
      'addNewClient',
    ]),

    clearData() {
      this.newClientData = [];
      this.contacts = [];
      this.errors =  null;
    },

    hideModal() {
      setTimeout(() => {
        this.clearData();
        this.$emit('hideModalClient', 'addClient');
      },
        0)
    },

    handleOutsideClick(event) {
      if (event.target !== this.$refs.content && event.target.contains(this.$refs.content)) {
        this.hideModal();
      }
    },

    addContact(newContact) {
      this.contacts = (newContact);
    },

    deleteContact(newContacts) {
      console.log(newContacts);
      this.contacts = (newContacts);
    },

    addNewClientInfo() {
      const client = {
        name: this.newClientData.name,
        surname: this.newClientData.surname,
        lastName: this.newClientData.lastName,
        contacts: this.contacts
      };

      axios.post(API_BASE_URL + 'api/clients', client,)
        .then((responce) => {
          this.clearData();
          this.hideModal();
          this.addNewClient(responce.data);
        })
        .catch((error) => {
          //console.log(error);
          this.errors = error.response.data.errors || {};
        })
    },
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
}
</script>
  
<style>
.input-placeholder input {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
}

.form-group input:valid+.placeholder {
  display: none;
}

.placeholder {
  margin: auto;
  position: absolute;
  pointer-events: none;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #B0B0B0;
}

.placeholder span {
  color: #9873FF;
}
</style>