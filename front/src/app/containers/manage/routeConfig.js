import User from '../user/User';
import Role from '../role/Role';

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
];