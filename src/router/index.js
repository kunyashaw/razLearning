import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/raz'
    },
    {
      path: '/raz',
      name: 'raz',
      component: () => import('../views/RazView.vue')
    },
    {
      path: '/oxford',
      name: 'oxford',
      component: () => import('../views/OxfordView.vue')
    },
    {
      path: '/me',
      name: 'me',
      component: () => import('../views/MeView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/book-detail',
      name: 'bookDetail',
      component: () => import('../views/BookView.vue')
    },
    {
      path: '/resource-link',
      name: 'resourceLink',
      component: () => import('../views/ResourceLinkView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

export default router