<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted() {
    let localTheme = localStorage.getItem("theme"); //gets stored theme value if any
    if (localTheme === null) {
      localStorage.setItem("theme", "darkMode");
      localTheme = "darkMode";
    }
    document.documentElement.setAttribute("data-theme", localTheme); // updates the data-theme attribute
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
