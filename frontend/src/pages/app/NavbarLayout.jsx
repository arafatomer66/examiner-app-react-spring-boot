
import React, { useContext, useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Space, Typography, Avatar, Tag, Badge } from 'antd';

import { AuthContext } from 'src/lib/context/authContext';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultTheme from 'src/lib/ThemeConfig';
import { LOGOUT_REDIRECT_URL, USER_ROLE, USER_ROLE_HUMAN_FRIENDLY } from 'src/lib/utils/constant';
import useRedirectIfRoleUndefined from 'src/lib/hooks/useRedirectIfRoleUndefined';
import { blue, gray, green } from '@ant-design/colors';
const colorBgContainer = defaultTheme.token.colorBgContainer;
const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;

export const AppNavbarLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathName = location.pathname;
    const { handleLogout, role, profile } = useContext(AuthContext);

    return (
        <Header
            style={{
                background: colorBgContainer,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                borderBottom: `1px solid ${gray[1]}`
            }}
        >
            <div>
                <Title level={5} style={{ fontWeight: "bold", display: 'inline', marginLeft: '30px' }}>EDGE EDUCATION</Title>
            </div>

            <div>
                {profile?.firstName != null
                    ?
                    <>
                        {
                            [USER_ROLE.ADMIN, USER_ROLE.BACKOFFICEREVIEWER, USER_ROLE.BACKOFFICEUPLOADER, USER_ROLE.TEACHER].includes(role) ?
                                <Tag color={blue[3]}> {USER_ROLE_HUMAN_FRIENDLY[role]} </Tag>
                                :
                                <> Hi, {profile?.firstName} ! &nbsp; </>
                        }
                        <Avatar style={{ backgroundColor: gray[5] }}>{String(profile?.firstName).toUpperCase()[0]}</Avatar>
                    </>
                    :
                    <></>
                }

            </div>
        </Header>
    )
}