import {
  Group as LayerGroup,
  Tile as TileLayer,
  Vector as VectorLayer
} from "ol/layer";
import {
  OSM,
  Stamen,
  BingMaps,
  Vector as VectorSource,
  TileImage,
  TileWMS
} from "ol/source";
import { Style, Fill, Stroke, Circle } from "ol/style";
import TileGrid from "ol/tilegrid/TileGrid";
import projzh from "projzh";
import { applyTransform } from "ol/extent";

import olSourceXYZ from 'ol/source/XYZ.js'


export default class Baselayers {
  static BaseLayersGroup(layers) {
    return new LayerGroup({
      title: "Base Layers",
      allwaysOnTop: true,
      openInLayerSwitcher: true,
      layers: layers
    });
  }
  static ShpLayersGroup(layers) {
    return new LayerGroup({
      title: "Taiwan ShpLayers",
      allwaysOnTop: true,
      openInLayerSwitcher: true,
      layers: layers
    });
  }

  static OSMLayer(isBaseLayer, isVisible) {
    return new TileLayer({
      title: "OSM",
      baseLayer: isBaseLayer,
      source: new OSM(),
      visible: isVisible
    });
  }

  // static StamenLayer(layerName, isBaseLayer, isVisible) {
  //   return new TileLayer({
  //     title: upperCaseFirst.call(this, layerName),
  //     baseLayer: isBaseLayer,
  //     source: new Stamen({
  //       layer: layerName
  //     }),
  //     visible: isVisible
  //   });
  // }

  static StamenLayer() {
    return new TileLayer({
      title: "Stamen地图",
      baseLayer: true,
      source: new Stamen({
        layer: 'watercolor'
      }),
      visible: false
    });
  }

  static BingMapLayer(layerName) {
    let apiKey = "AmIkqo8uC-dB6f4hwi25KIsz20zXiMMf9abz73sIpqXwtCn0TbqbgYYE9uOchE7F";  //申请Bing Map的api key
    return new TileLayer({
      preload: Infinity,
      baseLayer: true,
      title:"Bing地图",
      //title: upperCaseFirst.call(this, layerName),
      visible: false,
      source: new BingMaps({
        key: apiKey,
        imagerySet: layerName
      })
    });
  }


  static GaodeMapLayer(){
    return new TileLayer({
      preload: Infinity,
      baseLayer: true,
      title:"高德地图",
      visible: false,
      source: new olSourceXYZ({
        url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
      })
    })
  }

  static taiwan_waterwaysLayer(){
    let extent =[
      117.7835655,
      21.9313911,
      121.982875,
      26.1437728
    ];
  return new TileLayer({
    preload: Infinity,
    title:"taiwan_waterways",
    extent:applyTransform(extent, projzh.ll2bmerc),
    source: new TileWMS({     
        url: `api/geoserver/shp/wms`,
        params: {
            LAYERS: "DEM:taiwan_waterways",
            STYLES: "",
            VERSION: "1.1.1",
            FORMAT: "image/png",
        },
        serverType: "geoserver",
    }),
});


  }

  static taiwan_waterLayer(){
    let extent =[117.7835655,21.9313911,121.982875,26.1437728];
  return new TileLayer({
    preload: Infinity,
    title:"taiwan_water",
    extent:applyTransform(extent, projzh.ll2bmerc),
    source: new TileWMS({     
        url: `api/geoserver/shp/wms`,
        params: {
            LAYERS: "DEM:taiwan_water",
            STYLES: "",
            VERSION: "1.1.1",
            FORMAT: "image/png",
        },
        serverType: "geoserver",
    }),
});


  }
  static taiwan_transport(){
    let extent =[117.7835655,21.9313911,121.982875,26.1437728];
  return new TileLayer({
    preload: Infinity,
    title:"taiwan_transport",
    extent:applyTransform(extent, projzh.ll2bmerc),
    source: new TileWMS({     
        url: `api/geoserver/Shp_taiwan-latest-free/wms`,
        params: {
            LAYERS: "Shp_taiwan-latest-free:gis_osm_transport_free_1",
            STYLES: "",
            VERSION: "1.1.1",
            FORMAT: "image/png",
        },
        serverType: "geoserver",
    }),
});


  }

  static BaiDuLayer(layerName) {
    let tileGrid = getBaiDuTileGrid.call(this);
    let baiduSource = new TileImage({
      projection: "baidu",
      tileGrid: tileGrid,
      tileUrlFunction: function(tileCoord) {
        if (!tileCoord) {
          return "";
        }
        //z为缩放等级，x为横编号，y为纵编号
        let z = tileCoord[0];
        let x = tileCoord[1];
        let y = -tileCoord[2] - 1; //ol6的特点
        // let y = -tileCoord[2];//ol5的做法
        return (
          "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" +
          x +
          "&y=" +
          y +
          "&z=" +
          z +
          "&styles=pl&udt=20151021&scaler=1&p=1"
        );
      }
    });
    return new TileLayer({
      preload: Infinity,
      baseLayer: true,
      title: upperCaseFirst.call(this, layerName),
      visible: false,
      source: baiduSource
    });
  }
  //可以添加一个Style参数
  static BaiDuLayerCustom(layerName) {
    let tileGridCoustom = getBaiDuTileGrid.call(this);
    let baiduCustomSource = new TileImage({
      projection: "baidu",
      tileGrid: tileGridCoustom,
      tileUrlFunction: function(tileCoord) {
        if (!tileCoord) {
          return "";
        }
        //z为缩放等级，x为横编号，y为纵编号
        let z = tileCoord[0];
        let x = tileCoord[1];
        let y = -tileCoord[2] - 1; //ol6的做法
        // let y = -tileCoord[2];//ol5的做法
        return (
          "https://api.map.baidu.com/customimage/tile?&x=" +
          x +
          "&y=" +
          y +
          "&z=" +
          z +
          "&udt=20201210&scale=1&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&styles=t%3Aland%7Ce%3Aall%7Cc%3A%2300121cff%2Ct%3Awater%7Ce%3Aall%7Cc%3A%2300445dff%2Ct%3Ahighway%7Ce%3Aall%7Cc%3A%2307313fff%2Ct%3Asubway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Aall%7Cv%3Aon%7Cc%3A%23003242ff%2Ct%3Agreen%7Ce%3Aall%7Cv%3Aoff%2Ct%3Alabel%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%2335bd8500%2Ct%3Arailway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Alabel%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%2335bd85ff%7Cw%3A1%2Ct%3Abuilding%7Ce%3Aall%7Cv%3Aon%7Cc%3A%231692beff%2Ct%3Amanmade%7Ce%3Aall%7Cv%3Aoff%2Ct%3Agreen%7Ce%3Aall%7Cv%3Aoff%2Ct%3Apoi%7Ce%3Al.t.f%7Cv%3Aon%7Cc%3A%2335bd85ff%2Ct%3Apoi%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%2335bd8500%2Ct%3Apoi%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Alocal%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Al.i%7Cv%3Aoff"
        );
      }
    });
    return new TileLayer({
      preload: Infinity,
      baseLayer: true,
      title: upperCaseFirst.call(this, layerName),
      visible: false,
      source: baiduCustomSource
    });
  }

  static VectorLayer() {
    return new VectorLayer({
      title: "Vector",
      name: "baseVectorLayer",
      baseLayer: false,
      source: new VectorSource(),
      zIndex: 9999,
      style: new Style({
        fill: new Fill({
          color: "rgba(0,255, 0, 0.5)"
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2
        }),
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: "#ffcc33"
          })
        })
      })
    });
  }
}

Baselayers.BingMapLayerTypes = {
  Road: "Road",
  Aerial: "Aerial",
  AerialWithLabels: "AerialWithLabels",
  collinsBart: "collinBart",
  ordnanceSurvey: "ordnanceSurvey"
};

Baselayers.StamenLayerTypes = {
  Watercolor: "watercolor",
  Terrain: "terrain",
  Toner: "toner"
};

function upperCaseFirst(str) {
  return str[0].toUpperCase() + str.substring(1);
}

function getBaiDuTileGrid() {
  let extent = [-179.9, -90, 179.9, 90]; //设置显示范围
  let resolutions = []; //不同分辨率下的图幅数量
  for (let i = 0; i < 19; i++) {
    resolutions[i] = Math.pow(2, 18 - i);
  }
  //构建网格
  return new TileGrid({
    origin: [0, 0],
    resolutions: resolutions,
    extent: applyTransform(extent, projzh.ll2bmerc), //转换范围
    tileSize: [256, 256]
  });
}
