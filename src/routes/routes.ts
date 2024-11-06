import { createRouter, createWebHashHistory, RouteComponent } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'OverView',
      component: (): Promise<RouteComponent> => import('@/views/frontPage.vue'),
   
    },
  ],
});

export default router;
