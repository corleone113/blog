module.exports = {
    //数据库地址配置
    dbHost: '192.168.1.104',
    dbPort: '34105',
    apiHost: '192.168.1.107',
    apiPort: '2333',
    resources: [{
            name: '权限管理',
            parent: '',
            parent_id:'',
            route: '/admin/manage',
            icon: 'desktop'
        },
        {
            name: '用户管理',
            parent: '权限管理',
            parent_id:'',
            route: '/admin/manage/user',
            icon: 'user'
        },
        {
            name: '角色管理',
            parent: '权限管理',
            parent_id:'',
            route: '/admin/manage/role',
            icon: 'team'
        },
        {
            name: '资源管理',
            parent: '权限管理',
            parent_id:'',
            route: '/admin/manage/resource',
            icon: 'idcard'
        }
    ],
    adminUser: {
        username: 'admin',
        password: 'admin',
        email: '343534334@qq.com',
        gender: 1,
        website: 'github.com',
        phone: '18928499214',
        address: 'chengdu'
    },
    initRoles: [{
        name: '系统管理员'
    }, {
        name: '普通管理员'
    }]
}