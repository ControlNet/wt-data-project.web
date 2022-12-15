<script setup lang="ts">
  import navbarView from "@/views/navbarView.vue"
</script>

<template>
  <el-container direction="vertical">
    <navbarView></navbarView>
    <RouterView></RouterView>
  </el-container>
  <!----
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
    ---->
</template>

<style scoped>
</style>
