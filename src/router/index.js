import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/BuyPig/Home'
import BuyPig from '@/components/BuyPig/BuyPig'
import BuyTemplate from '@/components/BuyPig/BuyTemplate'
import BuyPigCombineComponents from '@/components/BuyPig/BuyPigCombineComponents'
import SasLog from '@/components/SasLog/SasLog'

Vue.use(Router)

export default new Router({
    mode: 'history',
    // base: '/137290/BuyPig/',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, 
    {
      path: '/BuyTemplate',
      name: 'BuyTemplate',
      component: BuyTemplate
    }, 
    {
      path: '/BuyPig',
      name: 'BuyPig',
      component: BuyPig
    }, 
    {
      path: '/BuyPigCombineComponents',
      name: 'BuyPigCombineComponents',
      component: BuyPigCombineComponents
    }, 
    {
      path: '/SasLog',
      name: 'SasLog',
      component: SasLog
    }
  ]
})
