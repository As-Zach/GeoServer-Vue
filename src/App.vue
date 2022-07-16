<template>
  <div id="app">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu router :default-openeds="['3']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-loading"></i>REST</template>
            <el-menu-item-group>
              <el-menu-item index="/tiffrest">Tiff自动发布</el-menu-item>
              <el-menu-item index="/shprest">Shp自动发布</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title"><i class="el-icon-map-location"></i>图层可视化</template>
            <el-menu-item-group>
              <el-menu-item index="/openlayer">OpenLayers</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/basemap">WebGIS</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title"><i class="el-icon-folder-opened"></i>地理数据管理</template>
            <el-menu-item-group>
              <Tree :data="arr" @nodeClick="selection($event)" index="/openlayer" v-if="isReloadData">
              </Tree>


            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 35px;">
          <span style="margin-right:30%;color:rgb(255, 255, 255); font-weight:bold">地 理 场 景 可 视 化 系 统 </span>
          <!-- 地 图 服 务 器 管 理 与 交 互 平 台 27%-->
          <span style="font-size: 15px;">Zach.</span>
        </el-header>
        <el-main style="height:auto; flex-grow:1;width: auto;">
          <div>
            <router-view></router-view>
          </div>

        </el-main>
      </el-container>
    </el-container>
    <el-dialog title="自动部署" :visible.sync="dialogVisible_show" width="40%" center>
      <el-form>
        <el-form-item label="选择WorkSpace">
          <el-select v-model="WorkSpace" size="mini" placeholder="WorkSpace" @change="fileurl">
            <el-option v-for="item in ws" :value="item" :key="item"></el-option>
          </el-select>
          <el-button type="success" plain size="mini" @click="newws">新建子工作区
          </el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-folder-add" :loading="loading.uploadLoading" @click="publishtif">
          Tiff自动部署
        </el-button>
        <el-button type="primary" icon="el-icon-folder-add" :loading="loading.uploadLoading" @click="publishshp">Shp自动部署
        </el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deletews">删除工作区
        </el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  //import { ref } from 'vue'
  import tree from '@/views/Tree'
  export default {
    data() {
      const item = {

      };
      return {
        // 刷新标识
        isReloadData: true,
        arr: tree.methods.getTree(),
        WorkSpace: "",
        ws: [
          'DEM',
          'map',
          'test',
          'city'
        ],
        loading: {
          uploadLoading: false,
        },
        dialogVisible_show: false,
        tableData: Array(20).fill(item),
        data: tree.methods.getData()
      }
    },

    methods: {
      selection($event) {

        if ($event.text == "GeoServer") {
          console.log($event.text)
          this.$router.push({
            name: 'OpenLayer',
            query: {
              name: $event.text
            }
          });
        } else if ($event.parent.text == "GeoServer") {
          this.dialogVisible_show = true;
          this.WorkSpace = $event.text
          this.fileurl();
          // this.$router.push({
          //   name: 'Rest',
          //   query: {
          //     name: $event.text
          //   }
          // });
        } else if ($event.parent.parent.text == "GeoServer") {
          var layername = $event.parent.text + ":" + $event.text
          console.log(layername);
          this.$router.push({
            name: 'OpenLayer',
            query: {
              name: layername
            }
          });
        } else if ($event.parent.parent.parent.text == "GeoServer") {
          var layername = $event.parent.parent.text + ":" + $event.text
          console.log(layername);
          this.$router.push({
            name: 'OpenLayer',
            query: {
              name: layername
            }
          });
        }
      },
      publishshp() {
        var that = this;
        this.loading.uploadLoading = true
        axios.post('http://localhost:8083/publishtreeshp', this.WorkSpace).then((response) => {
          console.log(response)
          this.loading.uploadLoading = false
          this.$message({
            message: 'Shp文件自动发布成功!!!',
            type: 'success'
          });
          this.$notify({
            title: '成功',
            message: 'Shp文件自动发布成功!!!',
            type: 'success',
            duration: 10000 //10s自动关闭通知栏
          });
          this.arr = tree.methods.getTree() //添加后获取刷新图层树
        })
      },
      publishtif() {
        var that = this;
        this.loading.uploadLoading = true
        axios.post('http://localhost:8083/publishtreetif', this.WorkSpace).then((response) => {
          console.log(response)
          this.loading.uploadLoading = false
          this.$message({
            message: 'Tiff文件自动发布成功!!!',
            type: 'success'
          });
          this.$notify({
            title: '成功',
            message: 'Tiff文件自动发布成功!!!',
            type: 'success',
            duration: 10000 //10s自动关闭通知栏
          });
          this.arr = tree.methods.getTree() //添加后获取刷新图层树
        })
      },
      deletews() {
        this.$message({
          message: '已成功删除工作区',
          type: 'warning'
        });
        this.$notify({
          title: '警告',
          message: '已成功删除工作区',
          type: 'warning',
          duration: 10000 //10s自动关闭通知栏
        });
      },
      fileurl() {
        var input = "F:\\Document\\Graduation Project\\MapData\\MapData\\" + this.WorkSpace
        axios.post('http://localhost:8083/findfile', input).then(function (response) {
          console.log(response)
        })
        axios.post('http://localhost:8083/findshpfile', input).then(function (response) {
          console.log(response)
        })
      },
      refreshTree() {
        console.log("refreshTree is working")
        console.log(this.arr)
        this.arr = tree.methods.getTree() //添加后获取刷新图层树
        console.log(this.arr)
      },
      newws(){

      },
    }
  };
</script>


<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  html,
  body,
  #app {
    height: 100%;
    margin: 0px;
    padding: 0px;
  }
</style>