import React, { useState, useEffect } from "react";
import { Layout, Button, Menu } from "antd";
import { MenuOutlined, MailOutlined, AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(!visible);
  };
  const navigate = useNavigate();
  
const items = [
  {
    label: 'Sign in',
    key: 'mail',
    children: [
      {
        label: 'Login',
        onClick: ()=> navigate('/auth/login')
      },
      {
        label: 'Backoffice Login',
        onClick: ()=> navigate('/auth/loginBackoffice')
      },
      {
        label: 'Admin Login',
        onClick: ()=> navigate('/auth/loginAdmin')
      },
    ],
  },
  {
    label: 'Sign up',
    key: 'signup',
    // icon: <SettingOutlined />,
    children: [
      {
        label: 'Signup',
        onClick: ()=> navigate('/auth/signup')
      },
      {
        label: 'Backoffice Signup',
        onClick: ()=> navigate('/auth/signupBackoffice')
      },
    ],
  },
];  
  // If you do not want to auto-close the mobile drawer when a path is selected
  // Delete or comment out the code block below
  // From here
  let { pathname: location } = useLocation();
  useEffect(() => {
    setVisible(false);
  }, [location]);
  // Upto here
  const onClick = (e) => {
    setCurrent(e.key);
  };
  const [current, setCurrent] = useState('mail');

  return (
    <Layout className="layout">
      <Layout.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: "60vw" }}>
        <div className="logo">
          <h3 style={{color: "white"}}>EDGE EDUCATION</h3>
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" >Something</Menu.Item>
          <Menu.Item key="2" >Another thing</Menu.Item>
          <Menu.Item key="3">Other things</Menu.Item>
        </Menu>
        </div>
        <Menu theme="dark" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        {/* <Button type="primary" style={{ marginRight: '10px' }}>Sign in</Button>
        <Button>Sign up</Button> */}
      </Layout.Header>
    </Layout>
  );
};

export default Navbar;
