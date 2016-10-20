<template>
  <div class="view-wrapper">
    <ul>
      <li><router-link to="/baseUsage">baseUsage</router-link></li>
      <li><router-link to="/date">date</router-link></li>
      <li><router-link to="/city">city</router-link></li>
    </ul>
    <router-view class="view"></router-view>
  </div>
</template>

<script>

import baseUsage from './component/baseUsage.vue';

import date from './component/date.vue';

import city from './component/city.vue';

export default {
  data () {
    return {}
  },
  components: { baseUsage, date, city}
}

</script>

<style lang="sass">

  .view-wrapper ul {

    padding: 0;
    display: flex;
    list-style-type: none;
    justify-content: space-between;

    a {
      color: #000000;
    }
  }

</style>
