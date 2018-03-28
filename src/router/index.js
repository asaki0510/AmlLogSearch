import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/BuyPig/Home'
import BuyPig from '@/components/BuyPig/BuyPig'
import BuyTemplate from '@/components/BuyPig/BuyTemplate'
import BuyPigCombineComponents from '@/components/BuyPig/BuyPigCombineComponents'
import SasLog from '@/components/AmlLog/SasLog'
import PrimeLog from '@/components/AmlLog/PrimeLog'


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
      path: '/SasLog',
      name: 'SasLog',
      component: SasLog
    },
    {
      path: '/PrimeLog',
      name: 'PrimeLog',
      component: PrimeLog
    }
  ]
})
