module.exports = {
    //数据库地址配置
    dbHost: '192.168.31.155',
    dbPort: '34105',
    apiHost: '192.168.31.92',
    apiPort: '2333',
    resources: [{
            name: '权限管理',
            parent: '',
            route: '/admin/manage',
            icon: 'desktop',
        },
        {
            name: '用户管理',
            parent: '权限管理',
            route: '/admin/manage/user',
            icon: 'user',
        },
        {
            name: '角色管理',
            parent: '权限管理',
            route: '/admin/manage/role',
            icon: 'team',
        },
    ],
    adminUser: {
        username: 'admin',
        password: 'admin',
        email: '343534334@qq.com',
        gender: 1,
        website: 'github.com',
        phone: '18928499214',
        address: 'chengdu',
        role:'管理员',
    },
    initRoles: [{
        name: '管理员',
        resources: [
            '权限管理',
            '用户管理',
            '角色管理',
        ],
    }, {
        name: '用户',
    }, ],
    forSecret:'corleone',
    jwtSecret:'corleone2019-8-17 16:12:25',
};