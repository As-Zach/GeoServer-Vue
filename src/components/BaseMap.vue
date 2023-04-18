<template>
  <div>
    <div class="right" style="margin-left:90%;">
      <el-switch v-model="sign" class="ml-2" inline-prompt active-color="#13ce66" inactive-color="#002fa7"
        active-text="2D" inactive-text="3D" @click="toggle3d"></el-switch>
    </div>
    
    <div id="map3d" style="boxShadow: 0 2px 12px 0 rgba(0,0,0,0.1)" ></div>
    <div id="map" style="boxShadow: 0 2px 12px 0 rgba(0,0,0,0.1)"v-show="sign"></div>
  </div>
</template>

<script>
  import Baselayers from "@/components/js/baselayers";
  import {
    Map,
    View
  } from "ol";
  import {
    addCoordinateTransforms,
    addProjection,
    fromLonLat,
    transform
  } from "ol/proj";
  import {
    controls
  } from "@/components/js/controls";
  import Projection from "ol/proj/Projection";
  import {
    applyTransform
  } from "ol/extent";
  import projzh from "projzh";
  import saveAs from "file-saver";

  import ImageWMS from "ol/source/ImageWMS";
  import Image from "ol/layer/Image";
  import Permalink from "ol-ext/control/Permalink"
  import SearchNominatim from "ol-ext/control/SearchNominatim"

  import olSourceXYZ from 'ol/source/XYZ.js'
  import olLayerTile from 'ol/layer/Tile.js'
  import OLCesium from 'ol-cesium'
  let Cesium = require('cesium/Source/Cesium');
  import "cesium/Source/Widgets/widgets.css";
  window.Cesium = Cesium


  // import "cesium/Source/Widgets/widgets.css";
  // import buildModuleUrl from "cesium/Source/Core/buildModuleUrl"
  // let Cesium = require('cesium/Source/Cesium');
  // window.Cesium = Cesium

  export default {
    name: "base-map",
    data() {
      return {
        sign: true,
        ol2d: '',
        ol3d: '',
        scene: '',
        map3dX:500,
        map3dY:500,
      };
    },
    components: {},
    computed: {},
    mounted() {
      console.log("BasMap is ready")
      //添加百度地图的投影
      let extent = [-179.9, -90, 179.9, 90];
      let baiduMercator = new Projection({
        code: "baidu",
        extent: applyTransform(extent, projzh.ll2bmerc),

        units: "m"
      });
      addProjection(baiduMercator);
      addCoordinateTransforms(
        "EPSG:4326",
        baiduMercator,
        projzh.ll2bmerc,
        projzh.bmerc2ll
      );
      addCoordinateTransforms(
        "EPSG:3857",
        baiduMercator,
        projzh.smerc2bmerc,
        projzh.bmerc2smerc
      );

      let bingMap = Baselayers.BingMapLayer(
        Baselayers.BingMapLayerTypes.AerialWithLabels
      );
      let osm = Baselayers.OSMLayer(true, true);
      let stamen = Baselayers.StamenLayer()
      let bdMapLayer = Baselayers.BaiDuLayer("百度地图");
      let bdMapLayerCustom = Baselayers.BaiDuLayerCustom("自定义百度地图");
      //   let gaodeMapLayer = new olLayerTile({
      //   title:"高德地图",
      //   source: new olSourceXYZ({
      //     url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
      //   })
      // })
      let gaodeMapLayer = Baselayers.GaodeMapLayer();
      let taiwan_waterways = Baselayers.taiwan_waterwaysLayer();
      let taiwan_water = Baselayers.taiwan_waterLayer();
      let taiwan_transport = Baselayers.taiwan_transport();
      let baseLayerGroup = Baselayers.BaseLayersGroup([
        stamen,
        bingMap,
        osm,
        bdMapLayer,
        //bdMapLayerCustom,
        gaodeMapLayer,
      ]);
      let shpLayerGroup = Baselayers.ShpLayersGroup([
       taiwan_water,taiwan_transport,taiwan_waterways,
      ]);
      let vectorLayer = Baselayers.VectorLayer();

      let centerPoint = transform([110, 30.0], 'EPSG:4326', 'EPSG:3857');
      let view = new View({
        center: centerPoint,
        zoom: 10
      });

      //设置显示两个滑动地图
      controls.swipe.addLayer(bingMap);
      controls.swipe.addLayer(osm, true);

      var cap = controls.wmsCapabilities
      // 组织控件工具栏
      controls.controlBar.addControl(controls.fullScreen);
      controls.controlBar.addControl(cap);
      controls.controlBar.addControl(controls.zoomToExtend);
      controls.controlBar.addControl(controls.rotate);
      controls.controlBar.setPosition("right");

      // 监听点击事件，设置图片保存事件
      controls.print.on(["print", "error"], e => {
        e.canvas.toBlob(blob => {
          saveAs(blob, "map." + e.imageType.replace("image/", ""));
        }, e.imageType);
      });

      

      var map = new Map({
        //挂载元素
        target: "map",
        //显示的地图
        layers: [baseLayerGroup, shpLayerGroup],
        //表层图层
        overlays: [],
        //在此设置地图控件
        controls: [
          controls.zoom,
          //controls.clickOverview,   //地图鹰眼点击控件(Overview)
          controls.globalOverview, //地球鹰眼转动控件(Globle)
          controls.switcher,
          controls.controlBar,
          controls.zoomSlider,
          controls.mousePosition, //鼠标位置控件(MousePosition)
          controls.scale,
          //controls.print,
          //controls.legend
        ],
        //开启交互时加载瓦片
        loadTilesWhileInteracting: true,
        //地图显示中心
        view: view
      });
      var plink = new Permalink({
        visible: false,
        localStorage: 'position'
      });
      map.addControl(plink);
      map.addControl(new SearchNominatim({
        zoomOnSelect: 10
      }));

      //test
      // let taiwan_waterways11 = Baselayers.taiwan_waterwaysLayer();
      // var gaodeLayer = new olLayerTile({
      //     //  source: new ol.source.XYZ({
      //     source: new olSourceXYZ({
      //       url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
      //     })
      //   })
      //   var gaodeLayer11 = new Image({
      //     source: new ImageWMS({
      //       //不能设置为0，否则地图不展示。
      //       ratio: 1.5,
      //       url: `api/geoserver/test/wms`,
      //       params: {
      //         LAYERS: "test:beijing",
      //         STYLES: "",
      //         VERSION: "1.1.1",
      //         FORMAT: "image/png",
      //       },
      //       serverType: "geoserver",
      //     }),
      //   });

      //   this.ol2d = new Map({
      //     layers: [gaodeLayer,gaodeLayer11],
      //     target: 'map',
      //     view: new View({
      //       projection: 'EPSG:4326',
      //       zoom: 16,
      //       center: [115.76666666666, 39.79333333333]
      //       // zoom: 18,
      //       // center: transform([ 108.945731,34.382717], 'EPSG:4326', 'EPSG:3857')
      //     })
      //   })
      this.ol3d = new OLCesium({
        map: map,
        target: 'map3d'
      })
      const scene = this.ol3d.getCesiumScene()
      //添加自己的Cesium Token 网址：https://cesium.com/ion/tokens?page=1
      Cesium.Ion.defaultAccessToken = 'Yourself Token...???'
      scene.terrainProvider = Cesium.createWorldTerrain({
    requestWaterMask: true
});
      // this.ol3d.setEnabled(true)

      cap.on('load', function (e) {
        map.addLayer(e.layer);
        e.layer.set('legend', e.options.data.legend);
        plink.setUrlParam('url', e.options.source.url);
        plink.setUrlParam('layer', e.options.source.params.LAYERS);
      });
    },
    methods: {
      toggle3d() {
        this.$nextTick(() => {
          this.sign = !this.sign;
          this.ol3d.setEnabled(!this.ol3d.getEnabled())
        })
       
      },
    },
    watch: {
      sign: function (newval) {
        if (newval) {
          this.ol3d.setEnabled(false)
          //this.sign=false
        } else {
          this.ol3d.setEnabled(true)
          //this.sign=true
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "../assets/widgets.scss";

  #map {
    height: 85%;
    width: 85%;
    position: fixed;
  }

  #map3d {
    height: 85%;
    width: 85%;
    position: fixed;
  }
</style>
