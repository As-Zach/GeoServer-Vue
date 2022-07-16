import Vue from 'vue'
import VueRouter from 'vue-router'
import Test from "../views/Test";
import App from "../App";
import Index from "../views/Index";
import TiffRest from "../views/TiffRest";
import ShpRest from "../views/ShpRest";
import OpenLayer from "../views/OpenLayer"
import Testlayer from "../views/Testlayer"
import Tree from '../views/Tree'
import TreeTest from '../views/TreeTest'
import Rest from '../views/Rest'
import BaseMap from '../components/BaseMap'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: '首页',
    component: Index
  },
  {
    path: '/tree',
    name: '图层树',
    component: Tree
  },
  {
    path: '/treetest',
    name: '图层树测试',
    component: TreeTest
  },
  {
    path: '/test',
    name: '测试',
    component: Test
  },
  {
    path: '/rest',
    name: 'Rest',
    component: Rest
  },
  {
    path: '/tiffrest' ,
    name: 'tiff自动发布',
    component: TiffRest
  },
  {
    path: '/shprest' ,
    name: 'shp自动发布',
    component: ShpRest
  },
  {
    path: '/openlayer',
    name: 'OpenLayer',
    component: OpenLayer
  },
  {
    path: '/basemap',
    name: 'BaseMap',
    component: BaseMap
  },
  {
    path: '/testlayer',
    name: 'Testlayer',
    component: Testlayer
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
