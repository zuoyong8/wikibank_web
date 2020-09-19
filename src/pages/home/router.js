import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: "hash",
    routes: [
        {
            path: '/',
            component: () => import("@/view/home")
        },
        {
            path: '/course',
            component: () => import("@/view/course")
        },
    ],
})


export default router;