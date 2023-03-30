<template>
  <main class="main">
    <section class="section">
      <div class="container">
        <h1 class="section-h1">Клиенты</h1>
        <table cellspacing="5" cellpadding="10" :class="{ 'table-margin': !isClientsEmpty, table: true }">
          <thead class="table-head">
            <tr>
              <th @click="sortById('id', sortedById)" class="table-header-cell table-header-cell--id">
                ID
                <img src="img/Arrow-up.svg" alt="Сортировка по убыванию" v-if="!sortedById">
                <img src="img/Arrow-down.svg" alt="Сортировка по возрвстанию" v-if="sortedById">
              </th>
              <th @click="sortByName('name', sortedByName)" class="table-header-cell">
                Фамилия Имя Отчество
                <img src="img/Arrow-up.svg" alt="Сортировка по убыванию" v-if="sortedByName">
                <img src="img/Arrow-down.svg" alt="Сортировка по возрвстанию" v-if="!sortedByName">
                <span class="table_head-colored">А-Я</span>
              </th>
              <th @click="sortByCreatedTime('createdAt', sortedByCreatedTime)" class="table-header-cell">
                Дата и время создания
                <img src="img/Arrow-up.svg" alt="Сортировка по убыванию" v-if="sortedByCreatedTime">
                <img src="img/Arrow-down.svg" alt="Сортировка по возрвстанию" v-if="!sortedByCreatedTime">
              </th>
              <th @click="sortByUpdatedTime('updatedAt', sortedByUpdatedTime)" class="table-header-cell">
                Последние изменения
                <img src="img/Arrow-up.svg" alt="Сортировка по убыванию" v-if="sortedByUpdatedTime">
                <img src="img/Arrow-down.svg" alt="Сортировка по возрвстанию" v-if="!sortedByUpdatedTime">
              </th>
              <th class="table-header-cell">Контакты</th>
              <th class="table-header-cell">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in getClientsInfo" :key="user.id">
              <td class="table-data-id">{{ user.id }}</td>
              <td class="table-data-name">{{ formateName(user.surname, user.name, user.lastName) }}</td>
              <td class="table-data-created">{{ formateDate(user.createdAt) }} <span class="td-time">{{
                formateTime(user.createdAt) }}</span></td>
              <td class="table-data-updated">{{ formateDate(user.updatedAt) }} <span class="td-time">{{
                formateTime(user.updatedAt) }}</span></td>
              <td class="table-data-contacts">
                <ContactsCell :contacts="user.contacts" />
              </td>
              <td>
                <div class="table-data-buttons">
                  <div class="action-buttons">
                    <svg class="svg-edit-person" width="13" height="13" viewBox="0 0 13 13" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 10.5V13H2.5L9.87333 5.62662L7.37333 3.12662L0 10.5ZM11.8067 3.69329C12.0667 3.43329 12.0667 3.01329 11.8067
                                   2.75329L10.2467 1.19329C9.98667 0.933291 9.56667 0.933291 9.30667 1.19329L8.08667 
                                   2.41329L10.5867 4.91329L11.8067 3.69329Z" fill="#9873FF" />
                    </svg>
                    <button class="btn-table-edit" ref="btnShow" :id="user.id"
                      @click.prevent="showEditModal(user.id)">Изменить</button>
                  </div>
                  <div class="action-buttons">
                    <svg class="svg-delete-person" width="16" height="16" viewBox="0 0 16 16" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.7" clip-path="url(#clip0_224_889)">
                        <path
                          d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354
                                     12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154
                                     5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z"
                          fill="#F06A4D" />
                      </g>
                      <defs>
                        <clipPath id="clip0_224_889">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <button class="btn-table-delete" @click="showDeleteModal(user.id)"> Удалить</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="isClientsEmpty" class="preloader-indicator">
          <svg class="preloader__image" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 
                          0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 
                          48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 
                          48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c
                          -26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 
                          48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z">
            </path>
          </svg>
        </div>

        <div class="newclient">
          <button class="btn-addclient" @click.prevent="showModalNewClient">
            <svg class="svg-add-person" width="23" height="16" viewBox="0 0 23 16" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.5 8C16.71 8 18.5 6.21 18.5 4C18.5 1.79 16.71 0 14.5 0C12.29 0 10.5 1.79 10.5 4C10.5 6.21 12.29
                             8 14.5 8ZM5.5 6V3H3.5V6H0.5V8H3.5V11H5.5V8H8.5V6H5.5ZM14.5 10C11.83 10 6.5 11.34 6.5 14V16H22.5V14C22.5 11.34 17.17 10 14.5 10Z"
                fill="#9873FF" />
            </svg>
            Добавить клиента
          </button>
        </div>

        <ModalNewClient :open="isNewClientActive" @hideModalClient="hideModalClient" />
        <ModalEditClient :id="id" :open="isEditClientActive" @hideModalClient="hideModalClient"
          @showDeleteModal="showDeleteModal" />
        <ModalDeleteClient :id="id" :open="isDeleteClientActive" @hideModalClient="hideModalClient" />

      </div>
    </section>
  </main>
</template>

<script>
import ModalNewClient from '@/components/ModalNewClient.vue';
import ModalEditClient from '@/components/ModalEditClient.vue';
import ModalDeleteClient from '@/components/ModalDeleteClient.vue';
import ContactsCell from '@/components/ContactsCell.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      isLoadingClients: true,
      cilent: {},
      id: '',

      sortedById: false,
      sortedByName: false,
      sortedByCreatedTime: false,
      sortedByUpdatedTime: false,

      isNewClientActive: false,
      isEditClientActive: false,
      isDeleteClientActive: false,
    }
  },
  components: {
    ContactsCell, ModalNewClient, ModalEditClient, ModalDeleteClient
  },
  methods: {
    ...mapActions([
      'deleteClient'
    ]),
    showModalNewClient() {
      this.isNewClientActive = true;
    },
    showEditModal(id) {
      console.log(id);
      this.id = id;
      this.isEditClientActive = true;
      location.hash = id;
    },
    showDeleteModal(id) {
      this.id = id;
      this.isDeleteClientActive = true;
    },

    hideModalClient(name) {
      location.hash = "";
      if (name === 'addClient') {
        this.isNewClientActive = false;
      }
      if (name === 'editClient') {
        this.isEditClientActive = false;
      }
      if (name === 'deleteClient') {
        this.isDeleteClientActive = false;
        this.isEditClientActive = false;
      }
    },

    showAddModal() {
      this.$bvModal.show('modal-newclient');
    },
    deleteClientByid(id) {
      this.deleteClient({ id: id });
    },
    formateName(name, surname, lastname) {
      if (name && surname && typeof lastname !== 'undefined') {
        return name + ' ' + surname + ' ' + lastname;
      }
      else {
        return name + ' ' + surname;
      }
    },
    formateDate(date) {
      return new Date(date).toLocaleDateString();
    },
    formateTime(date) {
      return new Date(date).toLocaleTimeString().slice(0, -3);
    },
    sortBy(prop, dir, comparator) {
      if (prop === 'updatedAt' || prop === 'createdAt') {
        this.getClientsInfo.sort(function (a, b) {
          const dateA = new Date(a[prop]);
          const dateB = new Date(b[prop]);
          return (dateA - dateB) * (dir ? 1 : -1);
        });

      }
      else
        this.getClientsInfo.sort((a, b) => comparator(a[prop], b[prop]) * (dir ? 1 : -1));

    },
    sortById(prop, dir) {
      this.sortedById = !this.sortedById;
      this.sortedByName = false;
      this.sortedByCreatedTime = false;
      this.sortedByUpdatedTime = false;
      this.sortBy(prop, dir, (a, b) => a - b);
    },
    sortByName(prop, dir) {
      this.sortedByName = !this.sortedByName;
      this.sortedById = false;
      this.sortedByCreatedTime = false;
      this.sortedByUpdatedTime = false;
      this.sortBy(prop, dir, (a, b) => a.localeCompare(b));
    },
    sortByCreatedTime(prop, dir) {
      this.sortedByCreatedTime = !this.sortedByCreatedTime;
      this.sortedByName = false;
      this.sortedById = false;
      this.sortedByUpdatedTime = false;
      this.sortBy(prop, dir, (a, b) => a.createdAt - b.createdAt);
    },
    sortByUpdatedTime(prop) {
      this.sortedByUpdatedTime = !this.sortedByUpdatedTime;
      this.sortedByCreatedTime = false;
      this.sortedByName = false;
      this.sortedById = false;
      this.sortBy(prop, this.sortedByUpdatedTime, (a, b) => a.updatedAt - b.updatedAt);
    },
  },
  computed: {
    ...mapGetters([
      'getClientsInfo'
    ]),
    isClientsEmpty() {
      return this.getClientsInfo.length === 0;
    }
  },
  mounted() {
    this.$nextTick(function () {
      setTimeout(() => {
        let hash = window.location.hash;
        hash = hash.replace('#', '');        
        this.getClientsInfo.forEach(element => {         
          if (element.id === (hash)) {
            location.hash = "";
            this.showEditModal(element.id);
          }
        });
      }, 1000);
    });
  }
};
</script>

