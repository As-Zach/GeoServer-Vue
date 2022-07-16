/**
 * 地图控件
 * 方便使用
 */
import {
  OverviewMap,
  ZoomSlider,
  Zoom,
  ScaleLine,
  FullScreen,
  Attribution,
  MousePosition,
  ZoomToExtent,
  Rotate
} from "ol/control";
import { defaults } from "ol/control";
import Baselayers from "@/components/js/baselayers";
import { createStringXY } from "ol/coordinate";
import Legend from "ol-ext/control/Legend";
import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import WMSCapabilities from "ol-ext/control/WMSCapabilities";
import Overview from "ol-ext/control/Overview";
import GeoBookmark from "ol-ext/control/GeoBookmark";
import Swipe from "ol-ext/control/Swipe";
import Globe from "ol-ext/control/Globe";
import Bar from "ol-ext/control/Bar";
import Print from "ol-ext/control/Print";
import Compass from "ol-ext/control/Compass";
import Target from "ol-ext/control/Target";
import { Style, Fill, Text } from "ol/style";

/**
 * ol 自带控件
 */
export const controls = {
  // 鹰眼图
  overview: new OverviewMap({
    collapsed: true,
    layers: [
      //ol6版本需要开发者设置一个新的地图资源，而ol5版本直接显示主图的缩略图
      Baselayers.OSMLayer(true, true) //ol6需要设置图层，ol5不需要
    ]
  }),
  // 缩放滑块
  zoomSlider: new ZoomSlider({
    duration: 800
  }),
  // 缩放按钮
  // className: 'control-right'
  zoom: new Zoom({
    duration: 200
  }),
  // 比例尺
  scale: new ScaleLine({
    className: "scale-left ol-scale-line"
  }),
  // 旋转
  rotate: new Rotate({}),
  // 地图版权
  attr: new Attribution({
    //该控件自动绑定网络地图的相关信息，如果没有提供则不显示
    //默认信息是收起状态，点击后显示
    className: "attr-right ol-attribution"
  }),
  // 鼠标位置
  mousePosition: new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: "EPSG:4326",
    undefinedHTML: "&nbsp"
  }),
  // 地图全屏
  fullScreen: new FullScreen({}),
  zoomToExtend: new ZoomToExtent({
    //不设置时显示全图
  }),
  // 地图图层切换
  switcher: new LayerSwitcher({
    show_progress: true,
    extent: true,
    trash: true,
  }),
  // wsm地图服务的查询与加载
  wmsCapabilities: new WMSCapabilities({
    srs: ["EPSG:4326"],
    cors: true,
    services :['api/geoserver/wms','https://ahocevar.com/geoserver/wms']
  }),
  // 平移到鹰眼图上的点击位置
  clickOverview: new Overview({
    collapsed: true,
    layers: [
      //ol6版本需要开发者设置一个新的地图资源，而ol5版本直接显示主图的缩略图
      Baselayers.OSMLayer(true, true) //ol6需要设置图层，ol5不需要
    ]
  }),
  // 地图位置书签
  geoBookmark: new GeoBookmark({
    
  }),
  // 地图对比控件
  swipe: new Swipe({
    orientation: "vertical" //'vertical'：水平对比；'horizontal'：垂直对比
  }),
  // 地球鹰眼控件
  globalOverview: new Globe({
    layers: [
      Baselayers.OSMLayer(true, true)
    ],
    panAnimation: "elastic",
    follow: true
  }),
  // 工具栏控件
  controlBar: new Bar({}),
  // 打印控件
  print: new Print({
    imageType: "image/png" //也可以是image/png
  }),
  // 指北针控件
  compass: new Compass({
    className: "bottom",
    rotateVithView: true,
    src: "http://viglino.github.io/ol-ext/examples/data/piratecontrol.png"
  }),
  // 地图中心控件
  center: new Target({
    style: new Style({
      text: new Text({
        text: "\uf140",
        font: "25px Fontawesome",
        fill: new Fill({ color: "red" })
      })
    }),
    composite: "default"
  }),

  //图例
  // legend: new Legend({
  //   className: "legend-right ol-legend",
  //   title: "Legend",
  //   size: [100, 210],
  //   collapsed: true
  // }),

  // 默认控件（）
  default: defaults() // 没有new
};
