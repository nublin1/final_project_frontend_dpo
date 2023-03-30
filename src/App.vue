<template>
  <div id="app">
    <body class="body">
      <header class="header">
        <div class="container-header">
          <div class="row-header">
            <picture class="header-logo">
              <source srcset="/img/logo-320.png" media="(max-width: 320px)">
              <source srcset="/img/logo.png" />
              <img src="/img/logo.png" alt="Logo">
            </picture>
            <form class="filter-form" action="/search" method="get">
              <input class="search-form" type="text" name="search" placeholder="Введите запрос" v-model="searchValue"
                @input="search(searchValue)">
            </form>
          </div>
        </div>
      </header>
      <router-view />
    </body>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
  created() {
    this.loadClients(this.searchValue);
  },
  data() {
    return {
      searchValue: '',
    }
  },
  methods: {
    ...mapActions([
      'loadClients',
    ]),
    search(value) {
      this.loadClients(value);
    }
  },
}

</script>
