import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'OverView',
      component: () => import('@/views/frontPage.vue'),

    },
    {
      path: '/receiver',
      name: 'Receiver.',
      component: () => import('@/views/ChromecastReceiver.vue'),

    },
  ],
});

export default router;

/*import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'OverView',
      component: () => import('@/views/frontPage.vue'),
   
    },
  ],
});

export default router;


*/