<script setup lang="ts">

</script>


<template>
    <el-header class="navbar">
      <div><img class="log64" src="/logo/logo64.png" alt=""/></div>
      <div><router-link to="/br-heatmap"><a class="page-tab">{{$t('Navbar.BrHeatmap')}}</a></router-link></div>
      <div><router-link to="/stacked-area"><a class="page-tab">{{$t('Navbar.StackedArea')}}</a></router-link></div>
      <div><router-link to="/todo-list" class="todo-list">{{$t('Navbar.TodoList')}}</router-link></div>
      <div><a class="link-tab" href="https://github.com/ControlNet/wt-data-project.web" target="_blank">{{$t('Navbar.WebRepo')}}</a></div>
      <div><a class="link-tab" href="https://github.com/ControlNet/wt-data-project.data" target="_blank">{{$t('Navbar.DataRepo')}}</a></div>
      <div><a class="link-tab" href="https://github.com/ControlNet/wt-data-project.web/issues" target="_blank">{{$t('Navbar.Issues')}}</a></div>
      <div><a class="link-tab nav-tab-point" href="https://github.com/ControlNet/wt-data-project.web/discussions" target="_blank">{{$t('Navbar.Forum')}}<span class="nav-tab-span">NEW</span></a></div>
      <div><a class="link-tab" href="https://github.com/ControlNet" target="_blank">{{$t('Navbar.Github')}}</a></div>
    </el-header>
</template>

<style scoped>
.log64{
    width: 32px;
    height: 32px;
}
.navbar{
    display: flex;
    align-items: center;
    height: auto;
    width: 100vw;
    background-color: black;
    flex-direction: row;
    flex-wrap: wrap;
}

.navbar > div {
  display: flex;
  align-items: center;
  transition:1s;
}

.navbar > div > a {
padding: 20px 16px;
}

.navbar > div:not(:first-child):hover{
  background: linear-gradient(rgb(0, 0, 0), rgb(30, 158, 218)); ;
  cursor: pointer;
}


.page-tab{
  color: #EEFFFF;
}

.todo-list{
  color: #F07178;
}

.link-tab{
  color:#89DDFF
}

.nav-tab-point{
  position: relative;
}

.nav-tab-span{
  position: absolute;
  color: #FFCB6B;
  font-size: 6px;
  top: 13px;
  left: 35px;
}
</style>