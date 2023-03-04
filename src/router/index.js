import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Login
  },
  {
    path: '/',
    name: 'index',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Index,
    children: [
      {
        path: '/index',
        name: 'information',
        component: () => import(/* webpackChunkName: "about" */ '../views/Information.vue')
      },
      {
        path: '/bookmanage',
        name: 'bookmanage',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/BookManage.vue')
      },
      {
        path: '/usermanage',
        name: 'usermanage',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/UserManage.vue')
      },
      {
        path: '/ordermanage',
        name: 'ordermanage',
        component: () => import(/* webpackChunkName: "about" */ '../views/OrderManage.vue'),
      },
      {
        path: '/commentmanage',
        name: 'commentmanage',
        component: () => import(/* webpackChunkName: "about" */ '../views/CommentManage.vue'),
      },
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    if (to.path === '/login') {
      next({ path: '/index' })
    } else {
      next()
    }
  } else {
    if (to.path !== '/login') {
      next({ path: '/login' })
    } else {
      next()
    }
  }
});

router.afterEach((to, from, next) => {

  window.scrollTo(0, 0)

});

export default router
