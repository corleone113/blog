import loadable from '@loadable/component';
const User = loadable(()=>import('../user/User'));
const Role = loadable(()=>import('../role/Role'));
const Tag = loadable(()=>import('../tag/Tag'));
const Article = loadable(()=>import('../article/Article'));

export default [
    {
        path: '/admin/manage/user',
        component: User,
        exact: true,
    },
    {
        path: '/admin/manage/role',
        component: Role,
        exact: true,
    },
    {
        path: '/admin/manage/tag',
        component: Tag,
        exact: true,
    },
    {
        path: '/admin/manage/article',
        component: Article,
        exact: true,
    },
];