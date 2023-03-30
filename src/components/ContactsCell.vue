<template>
  <span>
    <ul v-if="showAllContacts === false" class="list-reset table-contacts-list">
      <li v-for="(contact, index) in contactsPreview" :key="index" class="table-contacts-list-element">
        <div :class="getIconClass(contact.type)"
          v-tooltip="{ content: `<span class='highlight'>${contact.type}</span>: ${contact.value}` }">
        </div>
      </li>
      <button v-if="!showAllContacts && contacts.length > 4" class="btn-show-all-contacts data-icon data-icon--empty"
        @click.prevent="toggleShowAllContacts">
        +{{ contacts.length - 4 }}
      </button>
    </ul>
    <ul v-else class="list-reset table-contacts-list">
      <li v-for="(contact, index) in contacts" :key="index" class="table-contacts-list-element">
        <div :class="getIconClass(contact.type)"
          v-tooltip="{ content: `<span class='highlight'>${contact.type}</span>: ${contact.value}` }">
        </div>
      </li>
    </ul>
  </span>
</template>
  
<script>
export default {
  props: {
    contacts: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      showAllContacts: false,
    }
  },
  methods: {
    getIconClass(type) {
      switch (type) {
        case 'Email':
          return ['data-icon--email', 'data-icon']
        case 'Телефон':
          return ['data-icon--phone', 'data-icon']
        case 'Facebook':
          return ['data-icon--facebook', 'data-icon']
        case 'VK':
          return ['data-icon--vk', 'data-icon']
        default:
          return ['data-icon--person', 'data-icon']
      }
    },
    toggleShowAllContacts() {
      this.showAllContacts = true;
    }
  },
  computed: {
    contactsPreview() {
      return this.contacts.slice(0, 4);
    }
  }
}
</script>

<style>
.highlight {  
  color: rgb(192, 188, 188) ;
}

.tooltip {
  display: block;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  width: auto;
  max-width: 300px;

  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
  background: black;
  border-radius: 0;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  border-style: solid;
  position: absolute;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
  bottom: 0;
  left: calc(50% - 5px);
}


.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}
</style>