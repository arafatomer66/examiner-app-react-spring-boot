
import React, { useContext, useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Space, Typography, Avatar, Tag, Badge } from 'antd';

import { AuthContext } from 'src/lib/context/authContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDashBoardPaths } from './rolesDrawerRoutes';
import { ConfigProvider } from 'antd';
import defaultTheme from 'src/lib/ThemeConfig';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LOGOUT_REDIRECT_URL, USER_ROLE, USER_ROLE_HUMAN_FRIENDLY } from 'src/lib/utils/constant';
import useRedirectIfRoleUndefined from 'src/lib/hooks/useRedirectIfRoleUndefined';
import { blue, gray, green } from '@ant-design/colors';
import Navbar from './HomeNavbar';
import { AppNavbarLayout } from './AppNavbarLayout';
import { useDispatch } from 'react-redux';
import { resetSystem } from 'src/redux/services/system';
import { resetExam } from 'src/redux/services/exam';
const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;

const DrawerLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const pathName = location.pathname;
    const { handleLogout, role, profile } = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);
    const colorBgContainer = defaultTheme.token.colorBgContainer;
    function changeUrl(url, children) {
        if (children == null || children == undefined) {
            navigate(url);
        }
        else {
            return;
        }
    }

    const routerPathNames = getDashBoardPaths(role);

    function getDefaultKeys() {
        if (pathName == '/app/welcome') return ['0', null];
        for (let i = 0; i < routerPathNames.length; i++) {
            let search = false;
            const children = routerPathNames[i].children;
            const isChildrenNull = children == null || children == undefined;
            search = routerPathNames[i].url.search(pathName) != -1;
            if (search && isChildrenNull) {
                return [`${i}`, null];
            }
            if (isChildrenNull) continue;
            for (let j = 0; j < children.length; j++) {
                const search = children[j].url.search(pathName) != -1;
                // console.log({search, pathName, childPath: children[j].url, key: `${routerPathNames[i].name} ${j}`})
                if (search) {
                    return [`${routerPathNames[i].name} ${j}`, `${i}`];
                }
            }
        }
        return [null, null]
    }

    const [defaultSelectedKeys, defaultOpenKeys] = getDefaultKeys();

    useRedirectIfRoleUndefined();

    return (
        <ConfigProvider theme={defaultTheme}>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="demo-logo-vertical" />
                    <Space size='small' direction="vertical" align='center' className='w-100'
                        style={{ background: colorBgContainer, boxShadow: "0px 0.4px 0.4px 0.4px gray" }}
                    >
                        <Link to='/app/welcome'>
                            {!collapsed ?
                                <img src='/images/logo.png' alt="company-logo" width={200} height={150} />
                                :
                                <>
                                    <br />
                                    <img src='/images/logo.png' alt="company-logo" width={120} height={85} />
                                    <br />
                                </>
                            }
                        </Link>
                    </Space>
                    <Menu
                        theme="dark"
                        mode="inline"
                        // openKeys={['1']}
                        defaultSelectedKeys={defaultSelectedKeys}
                        defaultOpenKeys={defaultOpenKeys}
                        items={
                            [...routerPathNames.map((path, index) => {
                                return {
                                    key: `${index}`,
                                    icon: path.icon,
                                    label: path.name,
                                    onClick: () => changeUrl(path.url, path.children),
                                    ...(path.children ?
                                        {
                                            children: path.children.map((child, index) => {
                                                return {
                                                    key: `${path.name} ${index}`,
                                                    url: child.url,
                                                    label: child.name,
                                                    icon: child.icon,
                                                    onClick: () => changeUrl(child.url),
                                                }
                                            })
                                        } : {}
                                    )
                                }
                            }),
                            {
                                key: `-1`,
                                icon: <>
                                    <LogoutOutlined />
                                    <Text style={{ color: "white" }}>
                                        Logout
                                    </Text>
                                </>,
                                // icon: <LogoutOutlined />,
                                // label: 'Logout',
                                onClick: () => {
                                    handleLogout();
                                    dispatch(resetSystem())
                                    dispatch(resetExam())
                                    navigate(LOGOUT_REDIRECT_URL);
                                }
                            },

                            ]
                        }
                    />
                </Sider>
                <Content
                    style={{
                        background: colorBgContainer,
                        width: "100%",
                        overflow: "none",
                        textOverflow: "clip"
                    }}
                >
                    {/* <AppNavbarLayout /> */}

                    {children}
                </Content>
            </Layout>
        </ConfigProvider>
    );
};
DrawerLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DrawerLayout;