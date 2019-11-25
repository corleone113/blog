module.exports = {
    //数据库地址配置
    dbHost: '192.168.101.101',
    dbPort: '34105',
    apiHost: '192.168.101.102',
    apiPort: '2333',
    resources: [{
            name: '权限管理',
            parent: '',
            route: '/admin/manage/auth',
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
        {
            name: '博客管理',
            parent: '',
            route: '/admin/manage/blog',
            icon: 'form',
        },
        {
            name: '标签管理',
            parent: '博客管理',
            route: '/admin/manage/tag',
            icon: 'tags',
        },
        {
            name: '文章管理',
            parent: '博客管理',
            route: '/admin/manage/article',
            icon: 'edit',
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
        role: '系统管理员',
    },
    initRoles: [{
        name: '系统管理员',
        resources: [
            '权限管理',
            '用户管理',
            '角色管理',
            '博客管理',
            '标签管理',
            '文章管理',
        ],
    }, {
        name: '博客管理员',
        resources: [
            '博客管理',
            '标签管理',
            '文章管理',
        ],
    }, ],
    forSecret: 'corleone',
};