<template>
    <div class="app-container home">
      <el-row :gutter="20">
        <OpenLayer></OpenLayer>
      </el-row>
      <el-divider />
    </div>
  </template>
  
  <script>
  import OpenLayer from "@/views/OpenLayer";
  export default {
    name: "index",
    components: {
        OpenLayer,
    },
};
</script>

<style scoped>

</style>