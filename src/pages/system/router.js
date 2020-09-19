import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: "hash",
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import("@/view/login")
        },
        {
            path: '/course',
            component: () => import("@/view/course")
        },
        {
            path: '/download',
            name: 'download',
            component: () => import("@/view/download")
        },
        {
            path: "/sercert",
            component: () => import("@/view/forget_password")
        },
        {
            path: '/console',
            meta: { requireAuth: true },
            component: () => import("@/view/console"),
            children: [
                {
                    path: 'asset',
                    meta: {
                        requireAuth: true,
                    },
                    component: () => import('@/view/asset/asset')
                },
            ]
        },
        {
            path: '/usd',
            meta: { requireAuth: true },
            component: () => import("@/view/console"),
            children: [
                {
                    path: '',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/usd_account/index'),
                        list: () => import('@/view/usd_account/list'),
                    },
                }, 
                {
                    path: 'deposit',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/usd_account/index'),
                        list: () => import('@/view/usd_account/deposit'),
                    }
                },
                {
                    path: 'exchange',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/usd_account/index'),
                        list: () => import('@/view/usd_account/exchange'),
                    }
                },
                {
                    path: 'transfer',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/usd_account/index'),
                        list:  () => import('@/view/usd_account/transfer'),
                    }
                },
                {
                    path: 'withdraw',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/usd_account/index'),
                        list:  () => import('@/view/usd_account/withdraw'),
                    }
                }
            ]
        },
        {
            path: '/usdt',
            meta: { requireAuth: true },
            component: () => import("@/view/console"),
            children: [
                {
                    path: '',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/usdt_account/index'),
                        list: () => import('@/view/usdt_account/list'),
                    },
                }, 
                {
                    path: 'deposit',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/usdt_account/index'),
                        list: () => import('@/view/usdt_account/deposit'),
                    }
                },
                {
                    path: 'exchange',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/usdt_account/index'),
                        list: () => import('@/view/usdt_account/exchange'),
                    }
                },
                {
                    path: 'withdraw',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/usdt_account/index'),
                        list:  () => import('@/view/usdt_account/withdraw'),
                    }
                }
            ]
        },
        {
            path: '/btc',
            meta: { requireAuth: true },
            component: () => import("@/view/console"),
            children: [
                {
                    path: '',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/btc_account/index'),
                        list: () => import('@/view/btc_account/list'),
                    },
                }, 
                {
                    path: 'deposit',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/btc_account/index'),
                        list: () => import('@/view/btc_account/deposit'),
                    }
                },
                {
                    path: 'exchange',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/btc_account/index'),
                        list: () => import('@/view/btc_account/exchange'),
                    }
                },
                {
                    path: 'withdraw',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/btc_account/index'),
                        list:  () => import('@/view/btc_account/withdraw'),
                    }
                }
            ]
        },
        {
            path: '/eth',
            meta: { requireAuth: true },
            component: () => import("@/view/console"),
            children: [
                {
                    path: '',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/eth_account/index'),
                        list: () => import('@/view/eth_account/list'),
                    },
                }, 
                {
                    path: 'deposit',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/eth_account/index'),
                        list: () => import('@/view/eth_account/deposit'),
                    }
                },
                {
                    path: 'exchange',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/eth_account/index'),
                        list: () => import('@/view/eth_account/exchange'),
                    }
                },
                {
                    path: 'withdraw',
                    meta: {
                        requireAuth: true,
                    },
                    components: {
                        default: () => import('@/view/eth_account/index'),
                        list:  () => import('@/view/eth_account/withdraw'),
                    }
                }
            ]
        },
        {
            path: '/console',
            meta: { requireAuth: true },
            component: () => import("@/view/console"),
            children: [
                {
                    path: 'user',
                    meta: {
                        requireAuth: true,
                    },
                    component: () => import('@/view/user/user')
                },
            ]
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
})

router.beforeEach((to, from, next) => {
    const auth = localStorage.getItem('Authorization');
    if(to.matched.some( item => item.meta.requireAuth) ) {
        if(!auth) {
            next({
                path: '/',
                query: { redirect: to.pullPath },
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router;