<template>
  <span class="span-fill">
    <ul class="list-reset contact-list">
      <li v-for="(contact, index) in contacts" :key="index" class="contact-element">
        <select class="btn-dropdown-button-content" v-model="contact.type" name="contacts"
          @change="selectItem(contact, $event)">
          <option class="btn-dropdown-contact-item" v-for="(contactType, index) in items" :key="index">
            {{ contactType }}
          </option>
        </select>

        <input v-if="contact.type !== 'Телефон' && contact.type !== 'Email'" v-model="contact.value" type="text"
          placeholder="Введите данные контакта" class="contact-form-input">
        <input v-if="contact.type === 'Телефон'" v-model="contact.value" placeholder="Введите телефон "
          class="contact-form-input" v-maska data-maska="+7 (###) ###-##-##">
        <input v-if="contact.type === 'Email'" v-model="contact.value" type="email" placeholder="Введите email "
          class="contact-form-input">
        <button class="btn-deletecontact" @click="deleteContact(index)" v-tooltip="{ content: 'Удалить контакт' }"></button>
      </li>
    </ul>
    <div class="addcontact-space" v-if="contactsSize < 10">
      <span class="contact-add">
      </span>
      <button class="btn-addcontact" @click.prevent="addNewContact">
        Добавить контакт
      </button>
    </div>
  </span>
</template>

<script>
import { vMaska } from "maska"

export default {
  props: ['contacts'],
  data() {
    return {      
      items: ['Телефон', 'Email', 'Facebook', 'VK', 'Другое'],
    }
  },
  directives: { maska: vMaska },
  methods: {
    selectItem(contact, event) {
      contact.type =  event.target.value;
      contact.value = "";
    },
    addNewContact() {
      const newContact = {
        type: 'Другое',
        value: '',
      };
      const updatedContacts = this.contacts;
      updatedContacts.push(newContact);
      this.$emit('add-contact', updatedContacts);
    },
    deleteContact(index) {
      let updatedContacts = this.contacts;
      updatedContacts.splice(index, 1);
      this.$emit('delete-contact', updatedContacts);
    },    
  },
  computed: {
    contactsSize() {
      return this.contacts.length;
    }
  }
}
</script>

<style>
.span-fill {
  width: 100%;
}
</style>

