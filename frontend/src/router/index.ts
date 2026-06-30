import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ActividadesView from '../views/ActividadesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/actividades',
      name: 'actividades',
      component: ActividadesView,
      meta: { requiresAuth: true } 
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); 

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/actividades');
  } else {
    next();
  }
})

export default router