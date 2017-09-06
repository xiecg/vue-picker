import Vue from 'vue'
import Router from 'vue-router'
import BaseUsage from '@/components/BaseUsage'
import Date from '@/components/Date'
import City from '@/components/City'

Vue.use(Router)

export default new Router({
  routes: [
    {
      alias: '/',
      path: '/baseUsage',
      name: 'BaseUsage',
      component: BaseUsage
    },
    {
      path: '/date',
      name: 'Date',
      component: Date
    },
    {
      path: '/city',
      name: 'City',
      component: City
    }
  ]
})
