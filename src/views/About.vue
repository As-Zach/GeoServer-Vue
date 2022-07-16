<template>
  <div>
    <el-form>
      <el-form-item label="选择图层">
        <el-select v-model="layers" size="mini" placeholder="请选择">
          <el-option v-for="item in lay" :value="item" :key="item"></el-option>
        </el-select>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "about",
    data() {
      return {
        layers: "",
        lay: [],
      }
    },
    mounted() {
      this.getLay();
    },
    methods: {
      getLay: function () {
        axios.get('http://localhost:8083/testtt').then((response) => {
          console.log(response)
          this.lay = response.data
          console.log(this.lay)
        })
      }
    }
  }
</script>

<style scoped>

</style>