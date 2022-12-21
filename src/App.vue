<script setup lang="ts">
  import NavbarView from "@/views/NavbarView.vue"
  import GlobalLayoutVue from "./Layout/GlobalLayout.vue";
</script>

<template>
  <el-container direction="vertical">
    <NavbarView></NavbarView>
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
