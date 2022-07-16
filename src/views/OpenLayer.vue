<template>
    <div>
        <div>
            <el-form>
                <el-form-item label="选择图层">
                    <el-select v-model="layers" size="mini" filterable placeholder="请选择" @change="ChangeLayers($event)">
                        <el-option v-for="item in lay" :value="item" :key="item"></el-option>
                    </el-select>

                    <el-button type="primary" icon="el-icon-search" size="mini" @click="search">Search</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-right: 8px"
                        @click="deleteLayer">删除该图层
                    </el-button>
                </el-form-item>
                <el-form-item label="图层信息">
                    <el-select v-model="EPSG" size="mini" filterable allow-create placeholder="EPSG">
                        <el-option v-for="item in ep" :value="item" :key="item"></el-option>
                    </el-select>
                    <el-select v-model="MinX" size="mini" filterable allow-create placeholder="MinX"></el-select>
                    <el-select v-model="MinY" size="mini" filterable allow-create placeholder="MinY"></el-select>
                    <el-select v-model="MaxX" size="mini" filterable allow-create placeholder="MaxX"></el-select>
                    <el-select v-model="MaxY" size="mini" filterable allow-create placeholder="MaxY"></el-select>
                </el-form-item>
            </el-form>
        </div>

        <div id="openlayer" class="openlayer" style="boxShadow: 0 2px 12px 0 rgba(0,0,0,0.1)" v-if="isReloadData">
        </div>

    </div>
</template>

<script>
    //导入基本模块
    import "ol/ol.css";
    import Map from "ol/Map";
    import View from "ol/View";
    //导入相关模块
    import ImageWMS from "ol/source/ImageWMS";
    import Image from "ol/layer/Image";
    import {
        controls
    } from "@/components/js/controls";
    import App from '@/App'
    import tree from '@/views/Tree'


    export default {
        name: "OpenLayer",
        data() {
            return {
                // 刷新标识
                isReloadData: true,
                layers: "",
                lay: [],
                EPSG: "",
                NameSpace: "",
                MinX: "",
                MinY: "",
                MaxX: "",
                MaxY: "",
                ep: [
                    'EPSG:3857',
                    'EPSG:4326'
                ],
                ix: [],
                iy: [],
                ax: [],
                ay: [],
            };
        },
        mounted() {
            this.getLay();
        },
        watch: {
            '$route'(to, from) {
                // 路由发生变化重新获取路由传输数据
                this.layers = this.$route.query.name;
                console.log(this.layers)
            }
        },
        methods: {
            initMap() {
                var image = new Image({
                    source: new ImageWMS({
                        //不能设置为0，否则地图不展示。
                        ratio: 1.5,
                        url: `http://localhost:8080/geoserver/${this.NameSpace}/wms`,
                        params: {
                            LAYERS: this.layers,
                            //LAYERS: "test:beijing",
                            STYLES: "",
                            VERSION: "1.1.1",
                            FORMAT: "image/png",
                            
                        },
                        serverType: "geoserver",
                    }),
                });


                this.map = new Map({
                    //地图容器ID
                    target: "openlayer",
                    //引入地图
                    layers: [image],
                    view: new View({
                        //地图中心点
                        center: [this.MinX, this.MinY],
                        zoom: 1,
                        projection: 'EPSG:4326',
                        //extent:[115.4166666666667, 39.44333333333334, 117.5125, 41.05916666666667], 
                        //extent:[this.MinX, this.MinY, this.MaxX, this.MaxY]
                        //minZoom:-3, // 地图缩放最小级别
                    }),
                });
                console.log(this.map.getSize())
                this.map.getView().fit([this.MinX, this.MinY, this.MaxX, this.MaxY], this.map.getSize())
                this.$forceUpdate();
            },
            getLay: function () {
                axios.get('http://localhost:8083/layernames').then((response) => {
                    console.log(response)
                    this.lay = response.data
                    console.log(this.lay)
                })
            },
            ChangeLayers($event) {
                //this.$router.go(0)        //页面刷新
                this.$forceUpdate();
                console.log(this.layers)


            },
            search() {
                //刷新div
                this.isReloadData = false;
                this.$nextTick(() => {
                    this.isReloadData = true;
                })
                axios.post('http://localhost:8083/layerdetail', this.layers).then((response) => {
                    console.log(response.data)
                    this.EPSG = response.data.srs
                    this.NameSpace = response.data.nameSpace
                    console.log(this.EPSG)
                    this.MinX = response.data.minX
                    this.MinY = response.data.minY
                    this.MaxX = response.data.maxX
                    this.MaxY = response.data.maxY
                    console.log(`http://localhost:8080/geoserver/${this.NameSpace}/wms`)
                })
                setTimeout(() => { //延时函数
                    this.initMap();
                }, 1000);
            },
            deleteLayer() {
                axios.post('http://localhost:8083/delestore', this.layers).then((response) => {
                    console.log(response)
                    console.log(response.data)
                    if (response.data) {
                        this.$message({
                            message: '删除该图层成功!!!',
                            type: 'success'
                        });
                        this.$notify({
                            title: '成功',
                            message: '删除该图层成功!!!',
                            type: 'success',
                            duration: 10000 //10s自动关闭通知栏
                        });
                    } else {
                        this.$message.error(
                            '删除该图层失败!!!'
                        );
                        this.$notify.error({
                            title: '成功',
                            message: '删除该图层失败!!!',
                            duration: 10000 //10s自动关闭通知栏
                        });
                    }
                    this.$router.push({
                        name: '首页'
                    });
                    this.$router.go(0) //页面刷新
                })
            },
        },
    };
</script>

<style lang="scss">
    /* @import "../assets/border.scss"; */

    .openlayer {
        width: 100%;
        height: 500px;
        /* background: rgba(71, 67, 67, 0.1); */
    }
</style>