import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import LoginPage from "../views/LoginPage.vue";
import ForgetPassword from "../views/ForgetPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: 'login' }
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { guest: true },
  },
  {
    path: "/forget-password",
    name: "forget-password",
    component: ForgetPassword,
    meta: { guest: true },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword,
    meta: { guest: true },
  },
  {
    path: "/workout-dashboard",
    name: "workout-dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/workout-dashboard/:type/:classId/update/:id/:coachId",
    name: "workout-dashboard-update",
    component: () => import("../components/Client/ViewUpdateWorkout.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfilePage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile-detail",
    name: "detail-profile",
    component: () => import("../views/DetailedProfile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/performance",
    name: "Performance",
    component: () => import("../views/PerformancePage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import("../views/MessagesPage.vue"),
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      next("/workout-dashboard");
      return;
    }
    next();
  } else {
    next();
  }
});

export default router;
