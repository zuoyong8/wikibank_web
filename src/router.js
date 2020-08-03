import Vue from 'vue'
import Router from 'vue-router'
import login from './view/login.vue'

import Message from "./view/user/message";
import DepositDetail from "./view/record/deposit_detail";
import TransferDetail from "./view/record/transfer_detail";
import ForgetSercert from "./view/forget_password";
import Exchange from "./view/record/exchange"

Vue.use(Router)

const router = new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            name: 'login',
            component: login
        },
        {
            path: '/download',
            component: resolve => require(['./view/download'], resolve)
        },
        {
            path: "/sercert",
            meta: {
                requireAuth: true
            },
            component: ForgetSercert
        },
        {
            path: '/console',
            redirect: '/console/asset',
            meta: { requireAuth: true },
            component: resolve => require(['./view/console'], resolve),
            children: [
                {
                    path: "usd",
                    meta: {
                        requireAuth: true
                    },
                    component: () => import('./view/common/left'),
                    children: [
                        {
                            path: "",
                            meta: {
                                requireAuth: true,
                            },
                            component: () => import('./view/usd_account/index'),
                            children: [
                                {
                                    path: "",
                                    name: "list",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/usd_account/list'),
                                },
                                {
                                    path: "deposit",
                                    name: "deposit",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/usd_account/deposit'),
                                },
                                {
                                    path: "transfer",
                                    name: "transfer",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/usd_account/transfer'),
                                },
                                {
                                    path: "withdraw",
                                    name: "withdraw",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/usd_account/withdraw'),
                                },
                                {
                                    path: "exchange",
                                    name: "exchange",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/usd_account/exchange'),
                                }
                            ]
                        },

                    ]
                },
                {
                    path: "usdt",
                    meta: {
                        requireAuth: true
                    },
                    component: () => import('./view/common/left'),
                    children: [
                        {
                            path: "",
                            meta: {
                                requireAuth: true,
                            },
                            component: () => import('./view/usdt_account/index'),
                            children: [
                                {
                                    path: "",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/usdt_account/list'),
                                },
                                {
                                    path: "deposit",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/usdt_account/deposit'),
                                },
                                {
                                    path: "withdraw",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/usdt_account/withdraw'),
                                },
                                {
                                    path: "exchange",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/usdt_account/exchange'),
                                }
                            ]
                        },

                    ]
                },
                {
                    path: "btc",
                    meta: {
                        requireAuth: true
                    },
                    component: () => import('./view/common/left'),
                    children: [
                        {
                            path: "",
                            meta: {
                                requireAuth: true,
                            },
                            component: () => import('./view/btc_account/index'),
                            children: [
                                {
                                    path: "",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/btc_account/list'),
                                },
                                {
                                    path: "deposit",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/btc_account/deposit'),
                                },
                                {
                                    path: "withdraw",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/btc_account/withdraw'),
                                },
                                {
                                    path: "exchange",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/btc_account/exchange'),
                                }
                            ]
                        },

                    ]
                },
                {
                    path: "eth",
                    name: '',
                    meta: {
                        requireAuth: true
                    },
                    component: () => import('./view/common/left'),
                    children: [
                        {
                            path: "",
                            meta: {
                                requireAuth: true,
                            },
                            component: () => import('./view/eth_account/index'),
                            children: [
                                {
                                    path: "",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/eth_account/list'),
                                },
                                {
                                    path: "deposit",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/eth_account/deposit'),
                                },
                                {
                                    path: "withdraw",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/eth_account/withdraw'),
                                },
                                {
                                    path: "exchange",
                                    meta: {
                                        requireAuth: true,
                                    },
                                    component: () => import('./view/eth_account/exchange'),
                                }
                            ]
                        },

                    ]
                },
                {
                    path: 'asset', meta: { requireAuth: true }, component: resolve => require(['./view/common/left'], resolve),
                    children: [
                        { path: '/', meta: { requireAuth: true }, component: resolve => require(['./view/asset/asset'], resolve) },
                        { path: 'deposit', meta: { requireAuth: true }, component: resolve => require(['./view/asset/deposit'], resolve) },
                        { path: 'transfer', meta: { requireAuth: true }, component: resolve => require(['./view/asset/transfer'], resolve) },
                        { path: 'withdraw', meta: { requireAuth: true }, component: resolve => require(['./view/asset/withdraw'], resolve) }
                    ],

                },
                {
                    path: 'record', meta: { requireAuth: true }, component: resolve => require(['./view/common/left'], resolve),
                    children: [
                        { path: '/', meta: { requireAuth: true }, component: resolve => require(['./view/record/record'], resolve) },
                        { path: 'deposit', meta: { requireAuth: true }, component: resolve => require(['./view/record/deposit'], resolve) },
                        { path: 'transfer', meta: { requireAuth: true }, component: resolve => require(['./view/record/transfer'], resolve) },
                        { path: 'withdraw', meta: { requireAuth: true }, component: resolve => require(['./view/record/withdraw'], resolve) },
                        {
                            path: "deposit/:id",
                            meta: {
                                requireAuth: true,
                            },
                            component: DepositDetail
                        },
                        {
                            path: "transfer/:id",
                            meta: {
                                requireAuth: true,
                            },
                            component: TransferDetail
                        },
                        {
                            path: "exchange",
                            meta: {
                                requireAuth: true,
                            },
                            component: Exchange
                        }
                    ]
                },
                {
                    path: 'user', meta: { requireAuth: true }, component: resolve => require(['./view/common/left'], resolve),
                    children: [
                        {
                            path: '/', meta: { requireAuth: true }, component: resolve => require(['./view/user/user'], resolve),
                            // {path:'/',redirect:'/person',meta:{requireAuth:true},component:resolve=>require(['./view/user/user'],resolve),
                            // children:[
                            //     {path:'/person',meta:{requireAuth:true},component:resolve=>require(['./view/user/person'],resolve)},
                            //     {path:'/contact',meta:{requireAuth:true},component:resolve=>require(['./view/user/contactList'],resolve)}
                            //     ], 
                        },
                        //{path:'message', meta:{requireAuth:true},component:resolve=>require(['./view/user/message'],resolve)},
                        { path: 'setting', meta: { requireAuth: true }, component: resolve => require(['./view/user/setting'], resolve) },
                        { path: 'contact', meta: { requireAuth: true }, component: resolve => require(['./view/user/contact'], resolve) },
                        {
                            path: "message",
                            meta: {
                                requireAuth: true
                            },
                            component: Message
                        },

                    ]
                },
            ]
        }],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})


export default router;