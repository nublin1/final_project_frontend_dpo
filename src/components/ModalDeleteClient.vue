<template>
  <div class="modal-window" :class="{ 'modal-window--open': true }" v-if="open">
    <div class="modal-blackout"></div>
    <div class="modal">
      <div ref="content" class="modal_content">
        <div class="modal-header modal-header--delete">
          <h2 class="modal_content-title">
            Удалить клиента
          </h2>
          <button class="btn-cls" @click="hideModal">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M16.2332 1.73333L15.2665 0.766664L8.49985 7.53336L1.73318 0.766696L0.766515 1.73336L7.53318 8.50003L0.766542 
                  15.2667L1.73321 16.2333L8.49985 9.46669L15.2665 16.2334L16.2332 15.2667L9.46651 8.50003L16.2332 1.73333Z" fill="#B0B0B0" />
            </svg>
          </button>
        </div>
        <div class="modal-content-delete">
          <p>
            Вы действительно хотите удалить данного клиента?
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-savecontact" @click="deleteClientByid"> Удалить </button>
          <button class="btn-delelecontact" @click="hideModal"> Отмена </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { mapActions, } from 'vuex';

export default {
  props: ['id', 'open'],
  methods: {
    ...mapActions([
      'deleteClient'
    ]),
    deleteClientByid() {
      this.deleteClient({ id: this.id });
      this.hideModal();
    },
    hideModal() {
      setTimeout(() => {
        this.$emit('hideModalClient', 'deleteClient');
      },
        0)
    },
    handleOutsideClick(event) {
      if (event.target !== this.$refs.content && event.target.contains(this.$refs.content)) {
        this.hideModal();
      }
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
