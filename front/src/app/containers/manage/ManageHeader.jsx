import React from 'react';
import { Layout, } from 'antd';
import Toolbar from '@/components/toolbar/Toolbar';
import styles from './style.css';
const { Header, } = Layout;
const icon = require('./blog.png');
export default class extends React.Component {
    render() {
        const { userInfo, manage_logout, history: { push, }, } = this.props;
        const toolbarPayload = {
            items: [{ title: '首页', todo: () => push('/'), },
            { title: '退出', todo: manage_logout, }, ],
            title: `欢迎, ${userInfo?userInfo.username:''}`,
            overClass: styles.toolbar,
        };
        return (
            <Header>
                <img src={icon} alt="logo" className={styles.logo} />
                {userInfo && <Toolbar {...toolbarPayload} />}
            </Header>
        );
    }
}