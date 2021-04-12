<template>
  <div id="app">
    <Header/>
      <router-view />
    <Footer/>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
@import './assets/vendor/fontawesome/css/all.min.css';
@import './assets/css/style.css';
@import './assets/css/theme.css';
@import './assets/css/animate.css';
@import './assets/css/wow_book.css';
</style>
