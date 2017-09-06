<template>
  <div id="app">
    <ul>
      <li><router-link to="/BaseUsage">baseUsage</router-link></li>
      <li><router-link to="/Date">date</router-link></li>
      <li><router-link to="/City">city</router-link></li>
    </ul>
    <router-view class="view"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
* {
  -webkit-tap-highlight-color:transparent;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
#app ul {
  padding: 0;
  width: 100%;
  list-style-type: none;
  display: flex;
  justify-content: space-around;
  align-content: center;
}
#app a {
  font-size: 20px;
  color: #2c3e50;
}

.view {
  margin-top: 30px;
}
</style>
